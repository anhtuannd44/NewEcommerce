using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Notification.Repositories;

public class Repository<T, TKey> : DbContextRepository<NotificationDbContext, T, TKey> 
    where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(NotificationDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
