using System.ComponentModel.DataAnnotations;

namespace ECommerce.Common.Domain.Entities.BaseEntity;

public abstract class BaseEntity<TKey> : IHasKey<TKey>, ITrackable
{
    public TKey Id { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; }

    public DateTimeOffset CreatedDateTime { get; set; }

    public DateTimeOffset? UpdatedDateTime { get; set; }

    public Guid? CreatedById { get; set; }

    public Guid? UpdatedById { get; set; }
}