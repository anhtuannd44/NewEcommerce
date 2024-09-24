using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Notification.Entities;

namespace ECommerce.Notification.Repositories;

public class EmailMessageRepository : Repository<EmailMessage, Guid>, IEmailMessageRepository
{
    public EmailMessageRepository(NotificationDbContext dbContext,
        IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
