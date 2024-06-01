using ECommerce.Common.Application.Services;
using ECommerce.Common.Domain.IService;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Application;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services
            .AddScoped<IEmailSenderServiceBase, EmailSenderServiceBase>();
        return services;
    }
}