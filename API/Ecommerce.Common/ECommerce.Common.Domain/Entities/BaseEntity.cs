using System.ComponentModel.DataAnnotations;

namespace ECommerce.Common.Domain.Entities;

public abstract class BaseEntity<TId>
{
    /// <summary>
    /// Gets or sets the unique Entity Id
    /// </summary>
    public virtual TId Id { get; set; }

    /// <summary>
    /// Gets or sets the version (timestamp)
    /// </summary>
    [Timestamp]
    public virtual byte[] Version { get; set; }
}