using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Storage.Api.Repositories;

public class StorageDbContext : DbContextUnitOfWork<StorageDbContext>
{
    public StorageDbContext(DbContextOptions<StorageDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
