using ECommerce.Common.Infrastructure.Monitoring.AzureApplicationInsights;
using ECommerce.Common.Infrastructure.Monitoring.MiniProfiler;
using ECommerce.Common.Infrastructure.Monitoring.OpenTelemetry;

namespace ECommerce.Common.Infrastructure.Monitoring;

public class MonitoringOptions
{
    public MiniProfilerOptions MiniProfiler { get; set; }

    public AzureApplicationInsightsOptions AzureApplicationInsights { get; set; }

    public OpenTelemetryOptions OpenTelemetry { get; set; }
}