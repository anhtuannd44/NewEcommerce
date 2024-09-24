using System.Reflection;
using ECommerce.AuditLog.Authorization;
using ECommerce.AuditLog.ConfigurationOptions;
using ECommerce.AuditLog.DTOs;
using ECommerce.AuditLog.Entities;
using ECommerce.AuditLog.MessageBusConsumers;
using ECommerce.AuditLog.Repositories;
using ECommerce.Common.Application;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.HostedServices;
using ECommerce.Common.Infrastructure.MessageBrokers;
using ECommerce.Common.Infrastructure.Web.Authorization.Policies;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.AuditLog;

public static class AuditLogModuleServiceCollectionExtensions
{
    public static IServiceCollection AddAuditLogModule(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddDbContext<AuditLogDbContext>(options => options.UseSqlServer(appSettings.ConnectionStrings.ClassifiedAds, sql =>
        {
            if (!string.IsNullOrEmpty(appSettings.ConnectionStrings.MigrationsAssembly))
            {
                sql.MigrationsAssembly(appSettings.ConnectionStrings.MigrationsAssembly);
            }
        }))
            .AddScoped<IRepository<AuditLogEntry, Guid>, Repository<AuditLogEntry, Guid>>()
            .AddScoped<IRepository<IdempotentRequest, Guid>, Repository<IdempotentRequest, Guid>>();

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        services.AddAuthorizationPolicies(Assembly.GetExecutingAssembly(), AuthorizationPolicyNames.GetPolicyNames());

        services.AddTransient<IMessageBus, MessageBus>()
                .AddMessageBusReceiver<AuditLogAggregationConsumer, AuditLogCreatedEvent>(appSettings.MessageBroker);

        return services;
    }

    public static void MigrateAuditLogDb(this IApplicationBuilder app)
    {
        using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            serviceScope.ServiceProvider.GetRequiredService<AuditLogDbContext>().Database.Migrate();
        }
    }

    public static IServiceCollection AddHostedServicesAuditLogModule(this IServiceCollection services)
    {
        services.AddMessageBusConsumers(Assembly.GetExecutingAssembly());
        services.AddOutboxEventPublishers(Assembly.GetExecutingAssembly());

        services.AddHostedService<MessageBusConsumerBackgroundService<AuditLogAggregationConsumer, AuditLogCreatedEvent>>();

        return services;
    }
}
