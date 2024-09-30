using ECommerce.Common.CrossCuttingConcerns.DateTimes;

namespace ECommerce.Store.Api.Repositories;

public class ProductRepository : Repository<Entities.Product, Guid>, IProductRepository
{
    public ProductRepository(StoreDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }
}
