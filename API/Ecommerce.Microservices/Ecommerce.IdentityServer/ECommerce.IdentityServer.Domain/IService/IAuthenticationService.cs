using System.Security.Claims;
using ECommerce.Common.CrossCuttingConcerns.ProxyGenerationHooks;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.IdentityServer.Domain.DTOs;

namespace ECommerce.IdentityServer.Domain.IService;

public interface IAuthenticationService
{
    Task<bool> VerifyMinimumPasswordAgeAsync(Guid userId);

    Task<bool> VerifyPasswordAsync(Guid userId, string oldPassword);

    [NotIntercept]
    Task<bool> IsHistoricalPasswordAsync(Guid userId, string newPassword);

    Task AddToPasswordHistoryAsync(string userName);

    Task<GetByIdUserDto> GetUserByIdAsync(Guid id);

    Task UpdateUserAsync(UpdateUserDto userDto);
    
    Task<GetUserResponseDto> GetUsersAsync(string searchKey, string status, string sortBy,
        bool isAscending, int page, int pageSize);

    Task UpdateUserStatusAsync(Guid userId, bool isActive);
    
    Task AddToRolesAsync(Guid userId, AssignUserRolesDto roleUserDto);
    
    Task AddRefreshTokenAsync(RefreshToken refreshToken);

    Task RemoveRefreshTokenAsync(RefreshToken refreshToken);

    Task<RefreshToken> GetRefreshTokenByPart1(string refreshTokenPart1);

    Task<IList<Claim>> GetPermissionsAsync(Guid id);

    Task<UserLastRequestTimeDto> FindUserLastRequestTimeByUserIdAsync(Guid userId);
}