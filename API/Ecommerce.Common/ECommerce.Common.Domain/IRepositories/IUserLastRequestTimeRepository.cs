using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Common.Domain.IRepositories;

public interface IUserLastRequestTimeRepository
{
    Task UpdateUserLastRequestTimeAsync(Guid userId);

    Task<UserLastRequestTimeDto> FindUserLastRequestTimeByUserIdAsync(Guid userId);
}