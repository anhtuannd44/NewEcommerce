using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities;

public class ManagedEntity : BaseEntity<Guid>
{
    public Guid EntityId { get; set; }
    public Guid UserRoleId { get; set; }

    public virtual UserRole UserRole { get; set; }
}