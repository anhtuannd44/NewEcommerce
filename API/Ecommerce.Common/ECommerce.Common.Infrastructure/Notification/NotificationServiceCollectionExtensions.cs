using ECommerce.Common.Infrastructure.Notification.Email;
using ECommerce.Common.Infrastructure.Notification.Sms;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.Notification;

public static class NotificationServiceCollectionExtensions
{
    public static IServiceCollection AddNotificationServices(this IServiceCollection services, NotificationOptions options)
    {
        services.AddEmailNotification(options.Email);

        services.AddSmsNotification(options.Sms);

        return services;
    }
}
