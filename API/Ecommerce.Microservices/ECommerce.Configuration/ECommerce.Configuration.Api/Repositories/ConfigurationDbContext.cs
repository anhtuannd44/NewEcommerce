using System.Reflection;
using ECommerce.Common.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Configuration.Repositories;

public class ConfigurationDbContext : DbContextUnitOfWork<ConfigurationDbContext>
{
    public ConfigurationDbContext(DbContextOptions<ConfigurationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
