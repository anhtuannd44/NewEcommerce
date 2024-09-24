using ECommerce.IdentityServer.ConfigurationOptions.ExternalLogin;
using ECommerce.Infrastructure.Caching;
using ECommerce.Infrastructure.Interceptors;
using ECommerce.Infrastructure.Logging;
using ECommerce.Infrastructure.Monitoring;
using System.Collections.Generic;

namespace ECommerce.IdentityServer.ConfigurationOptions;

public class AppSettings
{
    public ConnectionStrings ConnectionStrings { get; set; }

    public IdentityServerOptions IdentityServer { get; set; }

    public LoggingOptions Logging { get; set; }

    public CachingOptions Caching { get; set; }

    public MonitoringOptions Monitoring { get; set; }

    public Dictionary<string, string> SecurityHeaders { get; set; }

    public InterceptorsOptions Interceptors { get; set; }

    public ExternalLoginOptions ExternalLogin { get; set; }

    public CookiePolicyOptions CookiePolicyOptions { get; set; }
}
