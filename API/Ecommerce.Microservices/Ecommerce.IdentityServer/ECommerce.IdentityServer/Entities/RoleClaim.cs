using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.IdentityServer.Entities;

public class RoleClaim : BaseEntity<Guid>
{
    public string Type { get; set; }
    public string Value { get; set; }

    public Role Role { get; set; }
}
