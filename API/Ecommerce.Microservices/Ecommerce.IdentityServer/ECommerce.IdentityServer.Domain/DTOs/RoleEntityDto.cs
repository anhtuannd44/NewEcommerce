namespace ECommerce.IdentityServer.Domain.DTOs;

public class RoleEntityDto
{
    public Guid RoleId { get; set; }
    public List<Guid> Entities { get; set; }
    public bool? IsManageAllEntities { get; set; }
}