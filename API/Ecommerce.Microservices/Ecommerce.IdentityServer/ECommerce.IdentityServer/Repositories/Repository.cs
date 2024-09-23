using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.IdentityServer.Repositories;

public class Repository<T, TKey> : DbContextRepository<IdentityDbContext, T, TKey>
    where T : BaseEntity<TKey>, IAggregateRoot
{
    public Repository(IdentityDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}