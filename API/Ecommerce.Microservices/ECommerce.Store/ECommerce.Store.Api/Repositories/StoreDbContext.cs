using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Store.Api.Repositories;

public class StoreDbContext : DbContextUnitOfWork<StoreDbContext>
{
    public StoreDbContext(DbContextOptions<StoreDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
