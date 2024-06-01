namespace ECommerce.Common.Domain.Entities.Identity;

public class Permission : BaseEntity<Guid>
{
    /// <summary>
    /// Gets or sets the RoleId
    /// </summary>
    public Guid RoleId { get; set; }
    
    /// <summary>
    /// Gets or sets the Permission Feature Value
    /// </summary>
    public string PermissionValue { get; set; }

    /// <summary>
    /// Gets or sets the Role information
    /// </summary>
    public virtual Role Role { get; set; }
}