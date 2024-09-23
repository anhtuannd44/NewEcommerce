namespace ECommerce.Common.Domain.Entities.BaseEntity;

public interface ITrackable
{
    byte[] RowVersion { get; set; }

    DateTimeOffset CreatedDateTime { get; set; }

    DateTimeOffset? UpdatedDateTime { get; set; }
}