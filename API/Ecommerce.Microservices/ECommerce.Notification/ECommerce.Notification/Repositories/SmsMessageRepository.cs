using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Notification.Entities;

namespace ECommerce.Notification.Repositories;

public class SmsMessageRepository : Repository<SmsMessage, Guid>, ISmsMessageRepository
{
    public SmsMessageRepository(NotificationDbContext dbContext,
        IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
