using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.DTOs.BaseDto;
using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class UserDto : BaseDto<Guid>
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string FullName { get; set; }
    public string Status { get; set; }

    public static IEnumerable<UserDto> FromUsers(IEnumerable<User> lstUser)
    {
        return lstUser.Select(item => new UserDto()
            {
                FullName = item.FullName,
                Id = item.Id,
                Status = item.Status.GetDescription(),
                UserName = item.UserName,
                PhoneNumber = item.PhoneNumber,
                Address = item.Address,
                Email = item.Email,
                Version = item.Version
            })
            .ToList();
    }
}