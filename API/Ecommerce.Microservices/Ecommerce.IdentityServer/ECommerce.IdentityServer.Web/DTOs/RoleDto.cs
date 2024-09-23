namespace ECommerce.IdentityServer.Web.DTOs;

public class RoleDto
{
    public Guid Id { get; set; }

    public virtual string Name { get; set; }

    public virtual string NormalizedName { get; set; }

    public virtual string ConcurrencyStamp { get; set; }
}
