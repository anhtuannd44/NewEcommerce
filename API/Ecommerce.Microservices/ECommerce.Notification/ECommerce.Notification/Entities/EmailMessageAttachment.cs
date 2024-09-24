using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Notification.Entities;

public class EmailMessageAttachment : BaseEntity<Guid>
{
    public Guid EmailMessageId { get; set; }

    public Guid FileEntryId { get; set; }

    public string Name { get; set; }

    public EmailMessage EmailMessage { get; set; }
}
