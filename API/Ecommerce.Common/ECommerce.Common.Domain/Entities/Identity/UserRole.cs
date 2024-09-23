namespace ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

public class UserRole : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public virtual User User { get; set; }
    public virtual Role Role { get; set; }
}