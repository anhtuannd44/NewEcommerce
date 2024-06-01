using ECommerce.Common.CrossCuttingConcerns.IO;
using ECommerce.Common.Infrastructure.IO;
using ECommerce.Common.Infrastructure.OS;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IDirectoryService, DirectoryService>()
                .AddDateTimeProvider();
        return services;
    }
}