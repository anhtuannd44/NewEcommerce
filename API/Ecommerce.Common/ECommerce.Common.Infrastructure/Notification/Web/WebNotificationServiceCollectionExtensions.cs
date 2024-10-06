using ECommerce.Common.Infrastructure.Notification.Web.Fake;
using ECommerce.Common.Infrastructure.Notification.Web.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.Notification.Web;

public static class WebNotificationServiceCollectionExtensions
{
    private static void AddSignalRWebNotification<T>(this IServiceCollection services, SignalROptions options)
    {
        services.AddSingleton<IWebNotification<T>>(new SignalRNotification<T>(options.Endpoint, options.Hubs[typeof(T).Name], options.MethodNames[typeof(T).Name]));
    }

    private static void AddFakeWebNotification<T>(this IServiceCollection services)
    {
        services.AddSingleton<IWebNotification<T>>(new FakeWebNotification<T>());
    }

    public static IServiceCollection AddWebNotification<T>(this IServiceCollection services, WebOptions options)
    {
        if (options.UsedFake())
        {
            services.AddFakeWebNotification<T>();
        }
        else if (options.UsedSignalR())
        {
            services.AddSignalRWebNotification<T>(options.SignalR);
        }

        return services;
    }
}
