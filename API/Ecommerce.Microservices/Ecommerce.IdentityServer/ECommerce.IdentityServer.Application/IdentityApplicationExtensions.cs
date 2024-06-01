using ECommerce.IdentityServer.Application.Services;
using ECommerce.IdentityServer.Domain.IService;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.IdentityServer.Application;

public static class IdentityApplicationExtensions
{
    public static IServiceCollection AddApplicationIdentityServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthenticationService, AuthenticationService>()
            .AddScoped<IEmailSenderService, EmailSenderService>();
        return services;
    }
}