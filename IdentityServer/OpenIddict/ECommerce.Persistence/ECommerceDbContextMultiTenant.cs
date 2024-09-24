using ECommerce.CrossCuttingConcerns.Tenants;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence;

public class ECommerceDbContextMultiTenant : ECommerceDbContext
{
    private readonly IConnectionStringResolver<ECommerceDbContextMultiTenant> _connectionStringResolver;

    public ECommerceDbContextMultiTenant(
        IConnectionStringResolver<ECommerceDbContextMultiTenant> connectionStringResolver)
        : base(new DbContextOptions<ECommerceDbContext>())
    {
        _connectionStringResolver = connectionStringResolver;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_connectionStringResolver.ConnectionString);
    }
}
