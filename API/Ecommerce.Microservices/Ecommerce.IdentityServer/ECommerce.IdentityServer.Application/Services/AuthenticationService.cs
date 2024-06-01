using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.CrossCuttingConcerns.OS;
using ECommerce.Common.Domain;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.Identity;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.IdentityServer.Application.ConfigurationOptions;
using ECommerce.IdentityServer.Domain.DTOs;
using ECommerce.IdentityServer.Domain.IService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.IdentityServer.Application.Services;

public class AuthenticationService : BaseService, IAuthenticationService
{
    private readonly IDateTimeServiceProvider _dateTimeServiceProvider;
    private readonly IUserLastRequestTimeRepository _userLastRequestTimeRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly AppSettingConfiguration _appSetting = new();

    public AuthenticationService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        IDateTimeServiceProvider dateTimeServiceProvider,
        IUserLastRequestTimeRepository userLastRequestTimeRepository,
        ILogger<AuthenticationService> logger,
        IPasswordHasher passwordHasher) : base(configuration, logger, unitOfWork)
    {
        _dateTimeServiceProvider = dateTimeServiceProvider;
        _userLastRequestTimeRepository = userLastRequestTimeRepository;
        _passwordHasher = passwordHasher;
        configuration.Bind(_appSetting);
    }

    public async Task<bool> VerifyPasswordAsync(Guid userId, string oldPassword)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == userId);
        return _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, oldPassword);
    }

    public async Task<bool> VerifyMinimumPasswordAgeAsync(Guid userId)
    {
        var user = await _unitOfWork.Repository<User>().Include(c => c.PasswordHistories).FirstOrDefaultAsync(x => x.Id == userId);

        if (user.RequirePasswordChanged)
        {
            return true;
        }

        var lastPassword = user.PasswordHistories.MaxBy(o => o.CreatedDate);
        if (lastPassword == null)
        {
            return true;
        }

        var minimumPasswordAge = _appSetting.Auth.MinimumPasswordAge * 24;
        var offset = _dateTimeServiceProvider.Now - lastPassword.CreatedDate;
        return offset.TotalHours > minimumPasswordAge;
    }

    public async Task<bool> IsHistoricalPasswordAsync(Guid userId, string newPassword)
    {
        var user = await _unitOfWork.Repository<User>().Include(c => c.PasswordHistories).FirstOrDefaultAsync(x => x.Id == userId);
        var passwordHistoryLimit = _appSetting.Auth.PasswordHistoryLimit;

        return user.PasswordHistories.OrderByDescending(o => o.CreatedDate)
            .Take(passwordHistoryLimit)
            .Any(w => _passwordHasher.VerifyHashedPassword(user, w.PasswordHash, newPassword));
    }

    public async Task AddToPasswordHistoryAsync(string userName)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.UserName == userName && x.Status == UserStatus.Active);
        user.UpdatedDate = _dateTimeServiceProvider.Now;
        user.RequirePasswordChanged = false;
        user.PasswordExpiryDate = _dateTimeServiceProvider.Now.AddDays(_appSetting.Auth.PasswordChangeDuration);

        _unitOfWork.Repository<PasswordHistory>().Add(
            new PasswordHistory
            {
                UserId = user.Id,
                PasswordHash = user.PasswordHash,
                CreatedDate = _dateTimeServiceProvider.Now
            });
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AddRefreshTokenAsync(RefreshToken refreshToken)
    {
        await _unitOfWork.Repository<RefreshToken>().AddAsync(refreshToken);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveRefreshTokenAsync(RefreshToken refreshToken)
    {
        _unitOfWork.Repository<RefreshToken>().Remove(refreshToken);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<RefreshToken> GetRefreshTokenByPart1(string refreshTokenPart1)
    {
        return await _unitOfWork.Repository<RefreshToken>().FirstOrDefaultAsync(x => x.Key == refreshTokenPart1);
    }

    public async Task<UserLastRequestTimeDto> FindUserLastRequestTimeByUserIdAsync(Guid userId)
    {
        return await _userLastRequestTimeRepository.FindUserLastRequestTimeByUserIdAsync(userId);
    }

    public async Task<IList<Claim>> GetPermissionsAsync(Guid id)
    {
        var userInfo = _unitOfWork.Repository<User>().Include(x => x.UserRoles).Where(u => u.Id == id);
        var roles = userInfo.SelectMany(u => u.UserRoles);
        var permissionClaims = await roles
            .SelectMany(r => r.Role.Permissions).Select(p => p.PermissionValue).Distinct()
            .ToListAsync();

        var claims = permissionClaims.Select(c => new Claim(c.ToString(), string.Empty, ClaimValueTypes.String, ECommerceConstants.ClaimIssuer)).ToList();

        return claims;
    }

    public async Task<GetUserResponseDto> GetUsersAsync(string searchKey, string status,
        string sortBy, bool isAscending, int page, int pageSize)
    {
        var query = _unitOfWork.Repository<User>().AsQueryable();

        var result = new GetUserResponseDto();

        if (!string.IsNullOrWhiteSpace(searchKey))
        {
            query = query.Where(x => x.FullName.Contains(searchKey));
        }

        query = query.WhereIf(!string.IsNullOrEmpty(status), x => x.Status == status.GetEnumValue<UserStatus>());

        query = query.OrderByIf(sortBy == "fullName", x => x.FullName, isAscending)
            .OrderByIf(sortBy == "userName" || string.IsNullOrEmpty(sortBy), x => x.UserName, isAscending)
            .OrderByIf(sortBy == "status", x => x.Status, isAscending);

        result.Total = await query.CountAsync();

        query = query.Paged(page, pageSize);

        var lstUser = await query.ToListAsync();

        result.Data = UserDto.FromUsers(lstUser);

        return result;
    }

    public async Task<GetByIdUserDto> GetUserByIdAsync(Guid id)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            return null;
        }

        var result = new GetByIdUserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            UserName = user.UserName,
            Status = user.Status.GetDescription()
        };

        return result;
    }

    public async Task UpdateUserAsync(UpdateUserDto userDto)
    {
        userDto = TrimUpdateUserDto(userDto);
        var existUser = await _unitOfWork.Repository<User>()
            .Include(ur => ur.UserRoles).ThenInclude(r => r.Role)
            .FirstOrDefaultAsync(x => x.Id == userDto.Id);

        if (existUser == null)
        {
            throw new ValidationException(Resource_Messages.User_NotExist);
        }

        if (existUser.Status == UserStatus.Active)
        {
            if (await _unitOfWork.Repository<User>()
                    .AnyAsync(x => x.Status == UserStatus.Active && x.UserName == userDto.UserName && x.Id != userDto.Id))
            {
                throw new ValidationException(ECommerceConstants.UserAlertExist);
            }
        }

        existUser.UserName = userDto.UserName;
        existUser.FullName = userDto.FullName;

        await _unitOfWork.SaveChangesAsync();
    }

    private UpdateUserDto TrimUpdateUserDto(UpdateUserDto updateUserDto)
    {
        updateUserDto.FullName = TrimInfoUser(updateUserDto.FullName);
        updateUserDto.UserName = TrimInfoUser(updateUserDto.UserName);
        return updateUserDto;
    }

    private string TrimInfoUser(string infoProfile)
    {
        return string.IsNullOrEmpty(infoProfile) ? string.Empty : infoProfile.Trim();
    }

    public async Task UpdateUserStatusAsync(Guid userId, bool isActive)
    {
        if (userId == Guid.Empty)
        {
            throw new ValidationException(Resource_Messages.User_UserIdEmpty);
        }

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new ValidationException(Resource_Messages.User_NotExist);
        }

        if (user.Status != UserStatus.Active && isActive)
        {
            var existedUsers = await _unitOfWork.Repository<User>().Where(x => x.Status == UserStatus.Active &&
                                                                               (x.UserName == user.UserName ||
                                                                                x.PhoneNumber == user.PhoneNumber))
                .ToListAsync();

            if (existedUsers.Exists(x => x.UserName == user.UserName))
            {
                throw new ValidationException(ECommerceConstants.UserAlertExist);
            }
        }

        user.Status = UserStatus.Active;
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AddToRolesAsync(Guid userId, AssignUserRolesDto roleUserDto)
    {
        if (userId == Guid.Empty)
        {
            throw new ValidationException(Resource_Messages.User_UserIdEmpty);
        }

        if (roleUserDto == null)
        {
            throw new ValidationException(
                string.Format(Resource_Messages.Core_Datavalidation_IsRequired, "roleUserDto"));
        }

        var roles = await _unitOfWork.Repository<Role>().Where(r => roleUserDto.Roles.Contains(r.Id)).ToListAsync();

        if (roleUserDto.RoleEntities is { Count: > 1 })
        {
            var duplicatedRole = roleUserDto.RoleEntities.GroupBy(r => r.RoleId).FirstOrDefault(g => g.Count() > 1);

            if (duplicatedRole != null)
            {
                var role = roles.Find(r => r.Id == duplicatedRole.Key);
                throw new ValidationException(string.Format(Resource_Messages.Core_DataValidator_Duplicated,
                    role != null ? role.Name : "User Role", "user role"));
            }
        }

        var user = await _unitOfWork.Repository<User>()
            .Include(x => x.UserRoles)
            .ThenInclude(r => r.Role)
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
        {
            throw new ValidationException(Resource_Messages.User_NotExist);
        }

        var rolesAfterEdit = roleUserDto.RoleEntities.Select(r => r.RoleId).ToList();

        var removeRoles = user.UserRoles.Where(r => !rolesAfterEdit.Contains(r.RoleId)).ToList();

        if (removeRoles.Count > 0)
        {
            _unitOfWork.Repository<UserRole>().RemoveRange(removeRoles);
        }

        var userRoleForAdding = roles.Where(role => user.UserRoles.All(r => r.RoleId != role.Id))
            .Select(role => new UserRole
            {
                RoleId = role.Id,
                UserId = user.Id
            }).ToList();

        await _unitOfWork.Repository<UserRole>().AddRangeAsync(userRoleForAdding);

        await _unitOfWork.SaveChangesAsync();
        await Task.CompletedTask;
    }
}