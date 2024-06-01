using ECommerce.Common.Infrastructure.ConfigurationOptions;
using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Common.Persistence.ConfigurationOptions;

namespace ECommerce.Shop.Application.ConfigurationOptions;

public class AppSettingConfiguration
{
    public TracingOptions Tracing { get; set; }
    public LoggingOptions Logging { get; set; }
    public SqlServerConnectionOptions SqlServerConnection { get; set; }
    public AuthOptions Auth { get; set; }
    public string UIDomainUrl { get; set; }
    public NotificationOptions Notification { get; set; }
    public HealthChecksOptions HealthChecks { get; set; }
    public EnvironmentOptions Environment { get; set; }
    public FileDirectory FileDirectory { get; set; }
    public string AppDomain { get; set; }
}

