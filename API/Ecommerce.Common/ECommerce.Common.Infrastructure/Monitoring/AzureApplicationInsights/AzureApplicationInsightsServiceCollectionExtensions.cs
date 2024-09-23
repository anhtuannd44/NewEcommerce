using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.Monitoring.AzureApplicationInsights;

public static class AzureApplicationInsightsServiceCollectionExtensions
{
    public static IServiceCollection AddAzureApplicationInsights(this IServiceCollection services, AzureApplicationInsightsOptions azureApplicationInsightsOptions = null)
    {
        if (!(azureApplicationInsightsOptions?.IsEnabled ?? false)) return services;
        services.AddApplicationInsightsTelemetry(opt => { opt.ConnectionString = azureApplicationInsightsOptions.ConnectionString; });

        services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, _) =>
        {
            module.EnableSqlCommandTextInstrumentation = azureApplicationInsightsOptions.EnableSqlCommandTextInstrumentation;
        });

        services.AddApplicationInsightsTelemetryProcessor<CustomTelemetryProcessor>();
        services.AddSingleton<ITelemetryInitializer, CustomTelemetryInitializer>();

        return services;
    }
}