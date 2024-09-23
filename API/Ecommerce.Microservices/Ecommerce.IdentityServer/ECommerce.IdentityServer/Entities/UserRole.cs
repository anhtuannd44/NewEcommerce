using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.IdentityServer.Entities;

public class UserRole : BaseEntity<Guid>
{
    public Guid UserId { get; set; }

    public Guid RoleId { get; set; }

    public User User { get; set; }

    public Role Role { get; set; }
}
