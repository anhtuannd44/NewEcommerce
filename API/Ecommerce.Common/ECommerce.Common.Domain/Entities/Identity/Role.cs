namespace ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

public class Role :  BaseEntity<Guid>
{
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsDefault { get; set; }
    /// <summary>true: active, false: inactive</summary>
    public bool Status { get; set; }

    public virtual IList<UserRole> Users { get; set; }
    public virtual IList<Permission> Permissions { get; set; }
}