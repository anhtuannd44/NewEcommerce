using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ECommerce.Common.Infrastructure.Storages.Local;

public class LocalFileHealthCheck : IHealthCheck
{
    private readonly LocalFileHealthCheckOptions _options;

    public LocalFileHealthCheck(LocalFileHealthCheckOptions options)
    {
        _options = options;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var testFile = $"{_options.Path}\\HealthCheck_{Guid.NewGuid()}.txt";
            using (var fs = File.Create(testFile))
            {
            }

            File.Delete(testFile);

            return Task.FromResult(HealthCheckResult.Healthy($"Path: {_options.Path}"));
        }
        catch (Exception ex)
        {
            return Task.FromResult(context.Registration.FailureStatus == HealthStatus.Unhealthy ? HealthCheckResult.Unhealthy(ex.Message) : HealthCheckResult.Degraded(ex.Message, ex));
        }
    }
}

public class LocalFileHealthCheckOptions : LocalOptions
{
}
