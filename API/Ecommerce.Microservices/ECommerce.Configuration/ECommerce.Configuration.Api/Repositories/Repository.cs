using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Configuration.Repositories;

public class Repository<T, TKey> : DbContextRepository<ConfigurationDbContext, T, TKey>
where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(ConfigurationDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
