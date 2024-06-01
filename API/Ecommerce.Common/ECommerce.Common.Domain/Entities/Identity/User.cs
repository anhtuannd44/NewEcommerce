using ECommerce.Common.Domain.Entities.Orders;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Identity;

public class User : AbstractEntity
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string PasswordHash { get; set; }
    public UserStatus Status { get; set; }
    public bool RequirePasswordChanged { get; set; }
    public DateTime? PasswordExpiryDate { get; set; }
    public int AccessFailedCount { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public string SecurityStamp { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }

    public virtual IList<UserRole> UserRoles { get; set; }
    public virtual IList<PasswordHistory> PasswordHistories { get; set; }
    public virtual IList<ConstructionStaff> ConstructionStaffs { get; set; }

    // public virtual IList<PasswordHistory> PasswordHistories { get; set; }
}