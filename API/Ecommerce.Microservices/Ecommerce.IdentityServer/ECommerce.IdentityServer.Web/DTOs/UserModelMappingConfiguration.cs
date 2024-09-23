using ECommerce.IdentityServer.Entities;

namespace ECommerce.IdentityServer.Web.DTOs;

public static class UserModelMappingConfiguration
{
    public static IEnumerable<UserDto> ToModels(this IEnumerable<User> entities)
    {
        return entities.Select(x => x.ToDto());
    }

    public static UserDto ToDto(this User entity)
    {
        if (entity == null)
        {
            return null;
        }

        return new UserDto
        {
            Id = entity.Id,
            UserName = entity.UserName,
            NormalizedUserName = entity.NormalizedUserName,
            Email = entity.Email,
            NormalizedEmail = entity.NormalizedEmail,
            EmailConfirmed = entity.EmailConfirmed,
            PhoneNumber = entity.PhoneNumber,
            PhoneNumberConfirmed = entity.PhoneNumberConfirmed,
            TwoFactorEnabled = entity.TwoFactorEnabled,
            ConcurrencyStamp = entity.ConcurrencyStamp,
            SecurityStamp = entity.SecurityStamp,
            LockoutEnabled = entity.LockoutEnabled,
            LockoutEnd = entity.LockoutEnd,
            AccessFailedCount = entity.AccessFailedCount,
        };
    }
}