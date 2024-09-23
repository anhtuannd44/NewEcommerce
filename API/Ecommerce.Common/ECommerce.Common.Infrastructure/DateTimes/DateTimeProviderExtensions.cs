using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.DateTimes;

public static class DateTimeProviderExtensions
{
    public static IServiceCollection AddDateTimeProvider(this IServiceCollection services)
    {
        _ = services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        return services;
    }
}