using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ECommerce.Common.Infrastructure.HealthChecks;

public class SqlServerHealthCheck : IHealthCheck
{
    private readonly string _connectionString;

    private readonly string _sql;

    public SqlServerHealthCheck(string connectionString, string sql)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException("connectionString");
        _sql = sql ?? throw new ArgumentNullException(nameof(sql));
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default(CancellationToken))
    {
        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);
            await using (var command = connection.CreateCommand())
            {
                command.CommandText = _sql;
                await command.ExecuteScalarAsync(cancellationToken);
            }

            return HealthCheckResult.Healthy();
        }
        catch (Exception exception)
        {
            return new HealthCheckResult(context.Registration.FailureStatus, null, exception);
        }
    }
}