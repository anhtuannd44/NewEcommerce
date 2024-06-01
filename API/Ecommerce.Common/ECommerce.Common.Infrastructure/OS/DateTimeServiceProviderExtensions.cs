using ECommerce.Common.CrossCuttingConcerns.OS;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.OS;

public static class DateTimeServiceProviderExtensions
{
    public static IServiceCollection AddDateTimeProvider(this IServiceCollection services)
    {
        _ = services.AddSingleton<IDateTimeServiceProvider, DateTimeServiceProvider>();
        return services;
    }
}