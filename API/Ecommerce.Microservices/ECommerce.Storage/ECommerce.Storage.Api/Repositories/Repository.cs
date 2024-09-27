using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Storage.Api.Repositories;

public class Repository<T, TKey> : DbContextRepository<StorageDbContext, T, TKey>
    where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(StorageDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
