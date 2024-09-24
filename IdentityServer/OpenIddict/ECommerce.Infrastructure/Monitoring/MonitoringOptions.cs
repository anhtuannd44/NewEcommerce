using ECommerce.Infrastructure.Monitoring.AzureApplicationInsights;
using ECommerce.Infrastructure.Monitoring.MiniProfiler;

namespace ECommerce.Infrastructure.Monitoring;

public class MonitoringOptions
{
    public MiniProfilerOptions MiniProfiler { get; set; }

    public AzureApplicationInsightsOptions AzureApplicationInsights { get; set; }
}
