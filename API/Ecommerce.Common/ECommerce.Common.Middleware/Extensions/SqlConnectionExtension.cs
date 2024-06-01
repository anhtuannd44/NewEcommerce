using ECommerce.Common.Persistence.ConfigurationOptions;

namespace ECommerce.Common.Middleware.Extensions;

public static class SqlConnectionExtension
{
    public static string GetAndBuildSqlConnection (this SqlServerConnectionOptions sqlServerConnection)
    {
        return sqlServerConnection.ConnectionStringTemplate
            .Replace("{Host}", sqlServerConnection.Host)
            .Replace("{Port}", sqlServerConnection.Port)
            .Replace("{Database}", sqlServerConnection.Database)
            .Replace("{UserName}", sqlServerConnection.UserName)
            .Replace("{Password}", sqlServerConnection.Password);
    }
}