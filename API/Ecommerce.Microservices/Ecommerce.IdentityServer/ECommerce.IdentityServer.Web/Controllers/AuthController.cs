using System.Diagnostics;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ECommerce.Common.CrossCuttingConcerns;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Cryptography.HashAlgorithms;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.IdentityServer.Domain.DTOs;
using ECommerce.IdentityServer.Domain.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RefreshToken = ECommerce.Common.Domain.Entities.Identity.RefreshToken;

namespace ECommerce.IdentityServer.Web.Controllers;

[ApiController]
[Route("api/identity")]
public class IdentityController : BaseController
{
    private Stopwatch _stopwatch;
    private readonly IAuthenticationService _authenticationService;
    private readonly IUserLastRequestTimeRepository _userLastRequestTime;
    private readonly ApplicationUserManager _applicationUserManager;
    private readonly SignInManager<User> _signInManager;

    public IdentityController(IAuthenticationService authenticationService,
        IConfiguration configuration,
        IUserLastRequestTimeRepository userLastRequestTime,
        ILogger<IdentityController> logger,
        ApplicationUserManager applicationUserManager,
        SignInManager<User> signInManager) : base(configuration, logger)
    {
        _authenticationService = authenticationService;
        _userLastRequestTime = userLastRequestTime;
        _applicationUserManager = applicationUserManager;
        _signInManager = signInManager;
    }

    [HttpGet]
    [Route("test")]
    [Authorize]
    public IActionResult TestAuth()
    {
        return Ok();
    }

    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginDto model)
    {
        return model.GrantType switch
        {
            ECommerceConstants.LoginTypePassword => await GrantResourceOwnerCredentialsAsync(model),
            ECommerceConstants.LoginTypeRefreshToken => await RefreshTokenAsync(model),
            _ => BadRequest(new LoginErrorResponse { Error = ECommerceConstants.UnsupportedGrantType })
        };
    }

    private async Task<IActionResult> GrantResourceOwnerCredentialsAsync(LoginDto model)
    {
        var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
        var response = new LoginErrorResponse
        {
            Error = ECommerceConstants.LoginError
        };

        _stopwatch = Stopwatch.StartNew();

        try
        {
            if (!IsValidEmail(model.Email))
            {
                response.ErrorDescription = ECommerceConstants.InvalidEmailMessage;
                LogTrace(model.Email, ipAddress, response.ErrorDescription);
                return BadRequest(response);
            }

            var user = await _applicationUserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                response.ErrorDescription = ECommerceConstants.InvalidEmailOrPasswordMessage;
                LogTrace(model.Email, ipAddress, ECommerceConstants.InvalidEmailOrPasswordMessage);
                return BadRequest(response);
            }

            if (await _applicationUserManager.IsLockedOutAsync(user))
            {
                response.ErrorDescription = ECommerceConstants.UserLockedOutMessage;
                LogTrace(model.Email, ipAddress, ECommerceConstants.UserLockedOutMessage);
                return BadRequest(response);
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (signInResult.Succeeded)
            {
                if (user.Status != UserStatus.Active)
                {
                    response.ErrorDescription = ECommerceConstants.UserIsInactiveMessage;
                    LogTrace(model.Email, ipAddress, ECommerceConstants.UserIsInactiveMessage);
                    return BadRequest(response);
                }

                if (user.RequirePasswordChanged)
                {
                    response.ErrorDescription = $"{ECommerceConstants.FirstLoginMessage};{user.UserName.GenerateSaltedHash(user.Id.ToString())}";
                    LogTrace(model.Email, ipAddress, ECommerceConstants.FirstLoginMessage);
                    return BadRequest(response);
                }

                if (user.PasswordExpiryDate.HasValue && user.PasswordExpiryDate.Value <= DateTime.Now)
                {
                    response.ErrorDescription = $"{ECommerceConstants.MessagePasswordExpired};{user.UserName.GenerateSaltedHash(user.Id.ToString())}";
                    LogTrace(model.Email, ipAddress, ECommerceConstants.MessagePasswordExpired);
                    return BadRequest(response);
                }

                await _applicationUserManager.ResetAccessFailedCountAsync(user);
                await _applicationUserManager.SetLockoutEnabledAsync(user, false);

                var permissionClaims = await _authenticationService.GetPermissionsAsync(user.Id);
                var permissionJson = !permissionClaims.Any()
                    ? string.Empty
                    : JsonSerializer.Serialize(permissionClaims
                        .Where(c => c.Issuer == ECommerceConstants.ClaimIssuer)
                        .Select(c => string.IsNullOrWhiteSpace(c.Value) ? c.Type : c.ToString()));

                LogTrace(model.Email, ipAddress, ECommerceConstants.LoginSuccessfullyMessage);

                var issueAt = DateTimeOffset.UtcNow;

                var (token, refreshToken) = await GenerateAccessAndRefreshToken(issueAt, user);

                var result = new LoginResponse
                {
                    UserInfo = new UserInfo
                    {
                        UserId = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        UserPermissions = permissionJson,
                        Address = user.Address,
                        PhoneNumber = user.PhoneNumber
                    },
                    TokenInfo = new TokenInfo
                    {
                        AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                        TokenType = ECommerceConstants.TokenTypeBearer,
                        Expires = token.ValidTo.ToString(CultureInfo.InvariantCulture),
                        ExpireIn = (_appSettings.Auth.TokenExpire.ResourceOwnerCredentials * 60) - 1,
                        RefreshToken = refreshToken
                    }
                };
                return Ok(result);
            }

            var accessFailedCount = await _applicationUserManager.GetAccessFailedCountAsync(user);
            if (accessFailedCount == 0)
            {
                await _applicationUserManager.SetLockoutEnabledAsync(user, false);
            }
            else if (_appSettings.Auth.MaxFailedAccessAttemptsBeforeLockout.Equals(accessFailedCount + 1))
            {
                await _applicationUserManager.SetLockoutEnabledAsync(user, true);
            }

            await _applicationUserManager.AccessFailedAsync(user);

            var logFailedMessage = ECommerceConstants.InvalidEmailOrPasswordMessage;

            if (await _applicationUserManager.IsLockedOutAsync(user))
            {
                logFailedMessage = ECommerceConstants.UserLockedOutMessage;
            }

            response.ErrorDescription = logFailedMessage;
            LogTrace(model.Email, ipAddress, logFailedMessage);
            return BadRequest(response);
        }
        catch (Exception e)
        {
            response.Error = ECommerceConstants.LoginError;
            response.ErrorDescription = e.Message;
            LogTrace(model.Email, ipAddress, e.Message);
            return BadRequest(response);
        }
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        if (!IsValidEmail(userDto.Email))
        {
            return BadRequest(new { message = ECommerceConstants.InvalidEmailMessage });
        }

        var user = new User()
        {
            Id = Guid.NewGuid(),
            Email = userDto.Email,
            UserName = userDto.Email,
            FullName = userDto.Fullname,
            Status = userDto.Status.GetEnumValue<UserStatus>(),
            PhoneNumber = userDto.PhoneNumber,
            Address = userDto.Address,
            RequirePasswordChanged = false,
            PasswordExpiryDate = DateTime.MaxValue
        };

        var result = await _applicationUserManager.CreateAsync(user, userDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = ECommerceConstants.UserAlertExist });
        }

        return Ok();
    }

    private bool IsValidEmail(string email)
    {
        return !string.IsNullOrEmpty(email) && email.IsEmail();
    }

    private async Task<(JwtSecurityToken, string)> GenerateAccessAndRefreshToken(
        DateTimeOffset issueAt, User user)
    {
        var permClaims = new List<Claim>()
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, issueAt.ToUnixTimeSeconds().ToString()),
        };

        //await _userLastRequestTime.UpdateUserLastRequestTimeAsync(user.Id);

        var expires = DateTime.Now.AddMinutes(_appSettings.Auth.TokenExpire.ResourceOwnerCredentials + 72000);
        var token = CreateToken(permClaims, expires);
        var refreshTokenPart1 = GenerateRefreshToken();
        var refreshTokenPart2 = GenerateRefreshToken();
        var refreshToken = $"{refreshTokenPart1}.{refreshTokenPart2}";

        var refreshTokenEntity = new RefreshToken
        {
            Key = refreshTokenPart1,
            UserId = user.Id,
            Expiration = DateTime.UtcNow.AddMinutes(_appSettings.Auth.TokenExpire.ResourceOwnerCredentials + 10),
            TokenHash = refreshToken.UseSha512().ComputeHashedString(),
        };
        await _authenticationService.AddRefreshTokenAsync(refreshTokenEntity);
        return (token, refreshToken);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
        }

        return randomNumber.UseSha256().ComputeHashedString();
    }

    private JwtSecurityToken CreateToken(IEnumerable<Claim> authClaims, DateTime expires)
    {
        var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Auth.Jwt.SymmetricKey));

        var token = new JwtSecurityToken(
            issuer: _appSettings.Auth.Jwt.Issuer,
            audience: _appSettings.Auth.Jwt.Audience,
            expires: expires,
            claims: authClaims,
            notBefore: DateTime.Now,
            signingCredentials: new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256));

        return token;
    }

    private async Task<IActionResult> RefreshTokenAsync(LoginDto model)
    {
        var refreshTokenPart1 = model.RefreshToken.Split('.')[0];
        var refreshToken = await _authenticationService.GetRefreshTokenByPart1(refreshTokenPart1);
        if (refreshToken == null ||
            refreshToken.ConsumedTime != null)
        {
            return BadRequest();
        }

        if (refreshToken.Expiration < DateTime.Now)
        {
            await _authenticationService.RemoveRefreshTokenAsync(refreshToken);
        }

        if (refreshToken.TokenHash != model.RefreshToken.UseSha512().ComputeHashedString() ||
            refreshToken.UserId == null ||
            refreshToken.UserId.Value == Guid.Empty)
        {
            return BadRequest();
        }

        return await RefreshTokenResourceOwnerCredentialsAsync(refreshToken.UserId.Value.ToString());
    }

    private async Task<IActionResult> RefreshTokenResourceOwnerCredentialsAsync(string userId)
    {
        var user = await _applicationUserManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest();
        }

        var issueAt = DateTime.UtcNow;
        var permClaims = new List<Claim>()
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, issueAt.ToString(CultureInfo.InvariantCulture)),
        };

        await _userLastRequestTime.UpdateUserLastRequestTimeAsync(user.Id);

        var expires = DateTime.Now.AddMinutes(_appSettings.Auth.TokenExpire.ResourceOwnerCredentials);
        var token = CreateToken(permClaims, expires);
        var newRefreshTokenPart1 = GenerateRefreshToken();
        var newRefreshTokenPart2 = GenerateRefreshToken();
        var newRefreshToken = $"{newRefreshTokenPart1}.{newRefreshTokenPart2}";

        var refreshTokenEntity = new RefreshToken
        {
            Key = newRefreshTokenPart1,
            UserId = user.Id,
            Expiration = DateTime.UtcNow.AddMinutes(_appSettings.Auth.TokenExpire.ResourceOwnerCredentials + 10),
            TokenHash = newRefreshToken.UseSha512().ComputeHashedString(),
        };

        await _authenticationService.AddRefreshTokenAsync(refreshTokenEntity);

        var permissionClaims = await _authenticationService.GetPermissionsAsync(user.Id);
        var permissionJson = !permissionClaims.Any()
            ? string.Empty
            : JsonSerializer.Serialize(permissionClaims.Where(c => c.Issuer == ECommerceConstants.ClaimIssuer)
                .Select(c => string.IsNullOrWhiteSpace(c.Value) ? c.Type : c.ToString()));

        return Ok(new LoginResponse
        {
            UserInfo = new UserInfo
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                UserPermissions = permissionJson,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber
            },
            TokenInfo = new TokenInfo
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                TokenType = ECommerceConstants.TokenTypeBearer,
                Expires = token.ValidTo.ToString(CultureInfo.InvariantCulture),
                ExpireIn = (_appSettings.Auth.TokenExpire.ResourceOwnerCredentials * 60) - 1,
                RefreshToken = newRefreshToken
            }
        });
    }

    private void LogTrace(string userName, string ipAddress, string message)
    {
        _stopwatch.Stop();
        _logger.LogInformation(string.Format(ECommerceConstants.MessageTrace, userName, ipAddress, _stopwatch.Elapsed, message));
    }
}