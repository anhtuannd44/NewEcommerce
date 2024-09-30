using ECommerce.CrossCuttingConcerns.CircuitBreakers;
using ECommerce.CrossCuttingConcerns.Locks;
using ECommerce.CrossCuttingConcerns.Tenants;
using ECommerce.Domain.Repositories;
using ECommerce.Persistence.CircuitBreakers;
using ECommerce.Persistence.Locks;
using ECommerce.Persistence.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECommerce.Persistence;

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

        services.AddDbContext<ECommerceDbContextMultiTenant>(_ => { })
                .AddScoped(typeof(ECommerceDbContext), serviceProvider => serviceProvider.GetRequiredService<ECommerceDbContextMultiTenant>())
                .AddRepositories();

        services.AddScoped(typeof(IDistributedLock), serviceProvider => new SqlDistributedLock(serviceProvider.GetRequiredService<IConnectionStringResolver<ECommerceDbContextMultiTenant>>().ConnectionString));

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>))
                .AddScoped(typeof(IAuditLogEntryRepository), typeof(AuditLogEntryRepository))
                .AddScoped(typeof(IUserRepository), typeof(UserRepository))
                .AddScoped(typeof(IRoleRepository), typeof(RoleRepository));

        services.AddScoped(typeof(IUnitOfWork), serviceProvider => serviceProvider.GetRequiredService<ECommerceDbContext>());

        services.AddScoped<ILockManager, LockManager>();
        services.AddScoped<ICircuitBreakerManager, CircuitBreakerManager>();

        return services;
    }

    public static void MigrateECommerceDb(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
        serviceScope.ServiceProvider.GetRequiredService<ECommerceDbContext>().Database.Migrate();
    }

    public static void MigrateOpenIddictDb(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
        serviceScope.ServiceProvider.GetRequiredService<OpenIddictDbContext>().Database.Migrate();

        var context = serviceScope.ServiceProvider.GetRequiredService<OpenIddictDbContext>();
        context.Database.Migrate();
    }
}
