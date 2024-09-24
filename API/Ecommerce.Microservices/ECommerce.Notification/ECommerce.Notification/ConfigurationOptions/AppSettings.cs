using ECommerce.Common.Infrastructure.Caching;
using ECommerce.Common.Infrastructure.Interceptors;
using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Common.Infrastructure.Monitoring;
using ECommerce.Common.Infrastructure.Notification;
using CryptographyHelper.Certificates;

namespace ECommerce.Notification.ConfigurationOptions;

public class AppSettings
{
    public ConnectionStrings ConnectionStrings { get; set; }

    public LoggingOptions Logging { get; set; }

    public CachingOptions Caching { get; set; }

    public MonitoringOptions Monitoring { get; set; }

    public IdentityServerAuthentication IdentityServerAuthentication { get; set; }

    public NotificationOptions Notification { get; set; }

    public InterceptorsOptions Interceptors { get; set; }
}

public class ConnectionStrings
{
    public string ClassifiedAds { get; set; }

    public string MigrationsAssembly { get; set; }
}

public class IdentityServerAuthentication
{
    public string Provider { get; set; }

    public string Authority { get; set; }

    public string ApiName { get; set; }

    public bool RequireHttpsMetadata { get; set; }

    public OpenIddictOptions OpenIddict { get; set; }
}

public class OpenIddictOptions
{
    public string IssuerUri { get; set; }

    public CertificateOption TokenDecryptionCertificate { get; set; }

    public CertificateOption IssuerSigningCertificate { get; set; }
}