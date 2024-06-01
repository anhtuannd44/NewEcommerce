using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.Common.Domain.Entities;

public class ManagedEntity : BaseEntity<Guid>
{
    public Guid EntityId { get; set; }
    public Guid UserRoleId { get; set; }

    public virtual UserRole UserRole { get; set; }
}