using ECommerce.IdentityServer.Entities;

namespace ECommerce.IdentityServer.Web.DTOs;

public static class RoleModelMappingConfiguration
{
    public static IEnumerable<RoleDto> ToModels(this IEnumerable<Role> entities)
    {
        return entities.Select(x => x.ToDto());
    }

    public static RoleDto ToDto(this Role entity)
    {
        if (entity == null)
        {
            return null;
        }

        return new RoleDto
        {
            Id = entity.Id,
            Name = entity.Name,
            NormalizedName = entity.NormalizedName,
            ConcurrencyStamp = entity.ConcurrencyStamp,
        };
    }
}