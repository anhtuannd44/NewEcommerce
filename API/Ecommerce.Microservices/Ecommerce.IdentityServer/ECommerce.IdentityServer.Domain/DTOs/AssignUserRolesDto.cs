namespace ECommerce.IdentityServer.Domain.DTOs;

public class AssignUserRolesDto
{
    public List<Guid> Roles { get; set; } = [];

    public List<RoleEntityDto> RoleEntities { get; set; }
}