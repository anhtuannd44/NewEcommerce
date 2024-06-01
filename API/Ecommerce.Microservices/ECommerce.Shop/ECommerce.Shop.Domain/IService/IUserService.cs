using ECommerce.Shop.Domain.DTOs.User;

namespace ECommerce.Shop.Domain.IService;

public interface IUserService
{
    Task<UserListResponseDto> GetUserListAsync(UserFilterParamsDto searchDto);
}