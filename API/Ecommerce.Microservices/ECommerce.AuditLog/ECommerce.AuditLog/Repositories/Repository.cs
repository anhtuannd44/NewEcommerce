using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.AuditLog.Repositories;

public class Repository<T, TKey> : DbContextRepository<AuditLogDbContext, T, TKey>
    where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(AuditLogDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
