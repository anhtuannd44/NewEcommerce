using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ECommerce.Common.Infrastructure.HealthChecks;

public static class HealthCheckBuilderExtensions
{
    public static IHealthChecksBuilder AddSqlServerCheck(
        this IHealthChecksBuilder builder,
        string connectionString,
        string healthQuery = default,
        string name = default,
        HealthStatus? failureStatus = default,
        IEnumerable<string> tags = default,
        TimeSpan? timeout = default)
    {
        return builder.Add(new HealthCheckRegistration(
            name,
            new SqlServerHealthCheck(connectionString, healthQuery),
            failureStatus,
            tags,
            timeout));
    }
}