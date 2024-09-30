using System.Reflection;
using ECommerce.Common.Application;
using ECommerce.Common.CrossCuttingConcerns.Csv;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.Csv;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Common.Infrastructure.MessageBrokers;
using ECommerce.Common.Infrastructure.Web.Authorization.Policies;
using ECommerce.Store.Api.Authorization;
using ECommerce.Store.Api.ConfigurationOptions;
using ECommerce.Store.Api.DTOs;
using ECommerce.Store.Api.Entities;
using ECommerce.Store.Api.HostedServices;
using ECommerce.Store.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Store.Api;

public static class ProductModuleServiceCollectionExtensions
{
    public static IServiceCollection AddProductModule(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddDbContext<StoreDbContext>(options => options.UseSqlServer(appSettings.ConnectionStrings.ECommerceDb, sql =>
        {
            if (!string.IsNullOrEmpty(appSettings.ConnectionStrings.MigrationsAssembly))
            {
                sql.MigrationsAssembly(appSettings.ConnectionStrings.MigrationsAssembly);
            }
        }));

        services
            .AddScoped<IRepository<Product, Guid>, Repository<Product, Guid>>()
            .AddScoped(typeof(IProductRepository), typeof(ProductRepository))
            .AddScoped<IRepository<AuditLogEntry, Guid>, Repository<AuditLogEntry, Guid>>()
            .AddScoped<IRepository<OutboxEvent, Guid>, Repository<OutboxEvent, Guid>>();

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        services.AddMediatR(config => config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddAuthorizationPolicies(Assembly.GetExecutingAssembly(), AuthorizationPolicyNames.GetPolicyNames());

        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<ICurrentUser, CurrentWebUser>();

        services.AddScoped(typeof(ICsvReader<>), typeof(CsvReader<>));
        services.AddScoped(typeof(ICsvWriter<>), typeof(CsvWriter<>));

        services.AddTransient<IMessageBus, MessageBus>()
                .AddMessageBusSender<AuditLogCreatedEvent>(appSettings.MessageBroker);

        return services;
    }

    public static void MigrateProductDb(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
        serviceScope.ServiceProvider.GetRequiredService<StoreDbContext>().Database.Migrate();
    }

    public static IServiceCollection AddHostedServicesProductModule(this IServiceCollection services)
    {
        services.AddMessageBusConsumers(Assembly.GetExecutingAssembly());
        services.AddOutboxEventPublishers(Assembly.GetExecutingAssembly());

        services.AddHostedService<PublishEventWorker>();

        return services;
    }
}
