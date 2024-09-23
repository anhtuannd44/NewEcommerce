using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.Caching;

public static class CachingServiceCollectionExtensions
{
    public static IServiceCollection AddCaches(this IServiceCollection services, CachingOptions options = null)
    {
        services.AddMemoryCache(opt => { opt.SizeLimit = options?.InMemory?.SizeLimit; });

        var distributedProvider = options?.Distributed?.Provider;

        switch (distributedProvider)
        {
            case "InMemory":
                services.AddDistributedMemoryCache(opt => { opt.SizeLimit = options?.Distributed?.InMemory?.SizeLimit; });
                break;
            case "Redis":
                services.AddDistributedRedisCache(opt =>
                {
                    opt.Configuration = options.Distributed.Redis.Configuration;
                    opt.InstanceName = options.Distributed.Redis.InstanceName;
                });
                break;
            case "SqlServer":
                services.AddDistributedSqlServerCache(opt =>
                {
                    opt.ConnectionString = options.Distributed.SqlServer.ConnectionString;
                    opt.SchemaName = options.Distributed.SqlServer.SchemaName;
                    opt.TableName = options.Distributed.SqlServer.TableName;
                });
                break;
        }

        return services;
    }
}