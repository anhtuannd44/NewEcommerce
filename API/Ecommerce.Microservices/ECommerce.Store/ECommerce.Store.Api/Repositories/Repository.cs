using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Store.Api.Repositories;

public class Repository<T, TKey> : DbContextRepository<StoreDbContext, T, TKey>
    where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(StoreDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
