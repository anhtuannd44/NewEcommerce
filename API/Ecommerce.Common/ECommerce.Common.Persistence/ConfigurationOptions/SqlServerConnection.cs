namespace ECommerce.Common.Persistence.ConfigurationOptions;

public class SqlServerConnectionOptions
{
    public string ConnectionStringTemplate { get; set; }
    public string Host { get; set; }
    public string Port { get; set; }
    public string Database { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}