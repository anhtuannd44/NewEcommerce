using ECommerce.CrossCuttingConcerns.CircuitBreakers;
using ECommerce.CrossCuttingConcerns.Locks;
using ECommerce.CrossCuttingConcerns.Tenants;
using ECommerce.Domain.Repositories;
using ECommerce.Persistence;
using ECommerce.Persistence.CircuitBreakers;
using ECommerce.Persistence.Locks;
using ECommerce.Persistence.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using System;

namespace Microsoft.Extensions.DependencyInjection;

public static class PersistenceExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, string connectionString, string migrationsAssembly = "")
    {
        services.AddDbContext<ECommerceDbContext>(options => options.UseSqlServer(connectionString, sql =>
                {
                    if (!string.IsNullOrEmpty(migrationsAssembly))
                    {
                        sql.MigrationsAssembly(migrationsAssembly);
                    }
                }))
                .AddDbContextFactory<ECommerceDbContext>((Action<DbContextOptionsBuilder>)null, ServiceLifetime.Scoped)
                .AddRepositories();

        services.AddScoped(typeof(IDistributedLock), _ => new SqlDistributedLock(connectionString));

        return services;
    }

    public static IServiceCollection AddMultiTenantPersistence(this IServiceCollection services, Type connectionStringResolverType, Type tenantResolverType)
    {
        services.AddScoped(typeof(IConnectionStringResolver<ECommerceDbContextMultiTenant>), connectionStringResolverType);
        services.AddScoped(typeof(ITenantResolver), tenantResolverType);

        services.AddDbContext<ECommerceDbContextMultiTenant>(options => { })
                .AddScoped(typeof(ECommerceDbContext), services =>
                {
                    return services.GetRequiredService<ECommerceDbContextMultiTenant>();
                })
                .AddRepositories();

        services.AddScoped(typeof(IDistributedLock), services =>
        {
            return new SqlDistributedLock(services.GetRequiredService<IConnectionStringResolver<ECommerceDbContextMultiTenant>>().ConnectionString);
        });

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>))
                .AddScoped(typeof(IAuditLogEntryRepository), typeof(AuditLogEntryRepository))
                .AddScoped(typeof(IUserRepository), typeof(UserRepository))
                .AddScoped(typeof(IRoleRepository), typeof(RoleRepository));

        services.AddScoped(typeof(IUnitOfWork), services =>
        {
            return services.GetRequiredService<ECommerceDbContext>();
        });

        services.AddScoped<ILockManager, LockManager>();
        services.AddScoped<ICircuitBreakerManager, CircuitBreakerManager>();

        return services;
    }

    public static void MigrateAdsDb(this IApplicationBuilder app)
    {
        using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
        {
            serviceScope.ServiceProvider.GetRequiredService<ECommerceDbContext>().Database.Migrate();
        }
    }

    public static void MigrateOpenIddictDb(this IApplicationBuilder app)
    {
        using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
        {
            serviceScope.ServiceProvider.GetRequiredService<OpenIddictDbContext>().Database.Migrate();

            var context = serviceScope.ServiceProvider.GetRequiredService<OpenIddictDbContext>();
            context.Database.Migrate();
        }
    }
}
