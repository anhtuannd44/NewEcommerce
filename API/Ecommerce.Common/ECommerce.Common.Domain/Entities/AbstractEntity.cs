using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.Common.Domain.Entities;

public abstract class AbstractEntity : BaseEntity<Guid>
{
    /// <summary>
    /// Gets or sets the UserId created
    /// </summary>
    public Guid? CreatedById { get; set; }

    /// <summary>
    /// Gets or sets the UserId updated
    /// </summary>
    public Guid? UpdatedById { get; set; }

    /// <summary>
    /// Gets or sets the time created entity
    /// </summary>
    public virtual DateTime? CreatedDate { get; set; }
    
    /// <summary>
    /// Gets or sets the time updated entity
    /// </summary>
    public virtual DateTime? UpdatedDate { get; set; }
}