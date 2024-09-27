using System.Reflection;
using ECommerce.Common.Application;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.HostedServices;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Common.Infrastructure.MessageBrokers;
using ECommerce.Common.Infrastructure.Storages;
using ECommerce.Common.Infrastructure.Web.Authorization.Policies;
using ECommerce.Storage.Api.Authorization;
using ECommerce.Storage.Api.ConfigurationOptions;
using ECommerce.Storage.Api.DTOs;
using ECommerce.Storage.Api.Entities;
using ECommerce.Storage.Api.HostedServices;
using ECommerce.Storage.Api.MessageBusConsumers;
using ECommerce.Storage.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Storage.Api;

public static class StorageModuleServiceCollectionExtensions
{
    public static IServiceCollection AddStorageModule(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddDbContext<StorageDbContext>(options => options.UseSqlServer(appSettings.ConnectionStrings.ECommerce, sql =>
        {
            if (!string.IsNullOrEmpty(appSettings.ConnectionStrings.MigrationsAssembly))
            {
                sql.MigrationsAssembly(appSettings.ConnectionStrings.MigrationsAssembly);
            }
        }))
            .AddScoped<IRepository<FileEntry, Guid>, Repository<FileEntry, Guid>>()
            .AddScoped<IRepository<AuditLogEntry, Guid>, Repository<AuditLogEntry, Guid>>()
            .AddScoped<IRepository<OutboxEvent, Guid>, Repository<OutboxEvent, Guid>>();

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        services.AddAuthorizationPolicies(Assembly.GetExecutingAssembly(), AuthorizationPolicyNames.GetPolicyNames());

        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<ICurrentUser, CurrentWebUser>();

        services.AddStorageManager(appSettings.Storage);

        services.AddTransient<IMessageBus, MessageBus>()
                .AddMessageBusSender<FileUploadedEvent>(appSettings.MessageBroker)
                .AddMessageBusSender<FileDeletedEvent>(appSettings.MessageBroker)
                .AddMessageBusSender<AuditLogCreatedEvent>(appSettings.MessageBroker)
                .AddMessageBusReceiver<WebhookConsumer, FileUploadedEvent>(appSettings.MessageBroker)
                .AddMessageBusReceiver<WebhookConsumer, FileDeletedEvent>(appSettings.MessageBroker);

        return services;
    }

    public static void MigrateStorageDb(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
        serviceScope.ServiceProvider.GetRequiredService<StorageDbContext>().Database.Migrate();
    }

    public static IServiceCollection AddHostedServicesStorageModule(this IServiceCollection services)
    {
        services.AddMessageBusConsumers(Assembly.GetExecutingAssembly());
        services.AddOutboxEventPublishers(Assembly.GetExecutingAssembly());

        services.AddHostedService<MessageBusConsumerBackgroundService<WebhookConsumer, FileUploadedEvent>>();
        services.AddHostedService<MessageBusConsumerBackgroundService<WebhookConsumer, FileDeletedEvent>>();
        services.AddHostedService<PublishEventWorker>();

        return services;
    }
}
