using System.Web;
using ECommerce.Common.Application.Common;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Authorization;
using ECommerce.IdentityServer.Commands.EmailMessages;
using ECommerce.IdentityServer.Commands.Users;
using ECommerce.IdentityServer.DTOs;
using ECommerce.IdentityServer.Queries;
using ECommerce.IdentityServer.Web.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.IdentityServer.Web.Controllers;

[Authorize]
[Produces("application/json")]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly Dispatcher _dispatcher;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public UsersController(Dispatcher dispatcher,
        UserManager<User> userManager,
        ILogger<UsersController> logger,
        IConfiguration configuration)
    {
        _dispatcher = dispatcher;
        _userManager = userManager;
        _configuration = configuration;
    }

    [Authorize(AuthorizationPolicyNames.GetUsersPolicy)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> Get()
    {
        var users = await _dispatcher.DispatchAsync(new GetUsersQuery());
        var dto = users.ToModels();
        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.GetUserPolicy)]
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<User>> Get(Guid id)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id, AsNoTracking = true });
        var dto = user.ToDto();
        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.AddUserPolicy)]
    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<User>> Post([FromBody] UserDto dto)
    {
        var user = new User
        {
            UserName = dto.UserName,
            NormalizedUserName = dto.UserName.ToUpper(),
            Email = dto.Email,
            NormalizedEmail = dto.Email.ToUpper(),
            EmailConfirmed = dto.EmailConfirmed,
            PhoneNumber = dto.PhoneNumber,
            PhoneNumberConfirmed = dto.PhoneNumberConfirmed,
            TwoFactorEnabled = dto.TwoFactorEnabled,
            LockoutEnabled = dto.LockoutEnabled,
            LockoutEnd = dto.LockoutEnd,
            AccessFailedCount = dto.AccessFailedCount,
        };

        _ = await _userManager.CreateAsync(user);

        dto = user.ToDto();
        return Created($"/api/users/{dto.Id}", dto);
    }

    [Authorize(AuthorizationPolicyNames.UpdateUserPolicy)]
    [HttpPut("{id}")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Put(Guid id, [FromBody] UserDto dto)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id });

        user.UserName = dto.UserName;
        user.NormalizedUserName = dto.UserName.ToUpper();
        user.Email = dto.Email;
        user.NormalizedEmail = dto.Email.ToUpper();
        user.EmailConfirmed = dto.EmailConfirmed;
        user.PhoneNumber = dto.PhoneNumber;
        user.PhoneNumberConfirmed = dto.PhoneNumberConfirmed;
        user.TwoFactorEnabled = dto.TwoFactorEnabled;
        user.LockoutEnabled = dto.LockoutEnabled;
        user.LockoutEnd = dto.LockoutEnd;
        user.AccessFailedCount = dto.AccessFailedCount;

        _ = await _userManager.UpdateAsync(user);

        dto = user.ToDto();
        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.SetPasswordPolicy)]
    [HttpPut("{id}/password")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> SetPassword(Guid id, [FromBody] SetPasswordDto dto)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var rs = await _userManager.ResetPasswordAsync(user, token, dto.Password);

        if (rs.Succeeded)
        {
            return Ok();
        }

        return BadRequest(rs.Errors);
    }

    [Authorize(AuthorizationPolicyNames.DeleteUserPolicy)]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id });
        await _dispatcher.DispatchAsync(new DeleteUserCommand { User = user });

        return Ok();
    }

    [Authorize(AuthorizationPolicyNames.SendResetPasswordEmailPolicy)]
    [HttpPost("{id}/passwordresetemail")]
    public async Task<ActionResult> SendResetPasswordEmail(Guid id)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id });

        if (user != null)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetUrl = $"{_configuration["IdentityServerAuthentication:Authority"]}/Account/ResetPassword?token={HttpUtility.UrlEncode(token)}&email={user.Email}";

            await _dispatcher.DispatchAsync(new AddEmailMessageCommand
            {
                EmailMessage = new EmailMessageDTO
                {
                    From = "phong@gmail.com",
                    Tos = user.Email,
                    Subject = "Forgot Password",
                    Body = string.Format("Reset Url: {0}", resetUrl),
                },
            });
        }
        else
        {
            // email user and inform them that they do not have an account
        }

        return Ok();
    }

    [Authorize(AuthorizationPolicyNames.SendConfirmationEmailAddressEmailPolicy)]
    [HttpPost("{id}/emailaddressconfirmation")]
    public async Task<ActionResult> SendConfirmationEmailAddressEmail(Guid id)
    {
        User user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = id });

        if (user != null)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationEmail =
                $"{_configuration["IdentityServerAuthentication:Authority"]}/Account/ConfirmEmailAddress?token={HttpUtility.UrlEncode(token)}&email={user.Email}";

            await _dispatcher.DispatchAsync(new AddEmailMessageCommand
            {
                EmailMessage = new EmailMessageDTO
                {
                    From = "phong@gmail.com",
                    Tos = user.Email,
                    Subject = "Confirmation Email",
                    Body = string.Format("Confirmation Email: {0}", confirmationEmail),
                },
            });
        }
        else
        {
            // email user and inform them that they do not have an account
        }

        return Ok();
    }
}