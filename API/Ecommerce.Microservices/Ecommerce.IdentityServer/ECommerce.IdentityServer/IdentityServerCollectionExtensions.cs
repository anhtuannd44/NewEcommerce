﻿using System.Reflection;
using ECommerce.Common.Application;
using ECommerce.IdentityServer.Entities;
using ECommerce.Common.Infrastructure.Web.Authorization.Policies;
using ECommerce.IdentityServer.Authorization;
using ECommerce.IdentityServer.ConfigurationOptions;
using ECommerce.IdentityServer.HostedServices;
using ECommerce.IdentityServer.IdentityProviders.Auth0;
using ECommerce.IdentityServer.IdentityProviders.Azure;
using ECommerce.IdentityServer.PasswordValidators;
using ECommerce.IdentityServer.Repositories;
using ECommerce.IdentityServer.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.IdentityServer;

public static class IdentityServerCollectionExtensions
{
    public static IServiceCollection AddIdentityModule(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddIdentity<User, Role>()
            .AddTokenProviders()
            .AddPasswordValidators();

        services.AddTransient<IUserStore<User>, UserStore>();
        services.AddTransient<IRoleStore<Role>, RoleStore>();

        ConfigureOptions(services);

        services.ConfigureApplicationCookie(options => { options.LoginPath = "/Account/Login"; });

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        return services;
    }

    public static IServiceCollection AddIdentityModuleCore(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddDbContext<IdentityDbContext>(options => options.UseSqlServer(appSettings.ConnectionStrings.ECommerceDb, sql =>
            {
                if (!string.IsNullOrEmpty(appSettings.ConnectionStrings.MigrationsAssembly))
                {
                    sql.MigrationsAssembly(appSettings.ConnectionStrings.MigrationsAssembly);
                }
            }))
            .AddScoped(typeof(IUserRepository), typeof(UserRepository))
            .AddScoped(typeof(IRoleRepository), typeof(RoleRepository));

        services.AddIdentityCore<User>()
            .AddTokenProviders()
            .AddPasswordValidators();

        services.AddTransient<IUserStore<User>, UserStore>();
        services.AddTransient<IRoleStore<Role>, RoleStore>();

        ConfigureOptions(services);

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        if (appSettings.Providers?.Auth0?.Enabled ?? false)
        {
            services.AddSingleton(new Auth0IdentityProvider(appSettings.Providers.Auth0));
        }

        if (appSettings.Providers?.AzureActiveDirectoryB2C?.Enabled ?? false)
        {
            services.AddSingleton(new AzureActiveDirectoryB2CIdentityProvider(appSettings.Providers.AzureActiveDirectoryB2C));
        }

        return services;
    }

    private static IdentityBuilder AddTokenProviders(this IdentityBuilder identityBuilder)
    {
        identityBuilder
            .AddDefaultTokenProviders()
            .AddTokenProvider<EmailConfirmationTokenProvider<User>>("EmailConfirmation");

        return identityBuilder;
    }

    private static void AddPasswordValidators(this IdentityBuilder identityBuilder)
    {
        identityBuilder
            .AddPasswordValidator<WeakPasswordValidator>()
            .AddPasswordValidator<HistoricalPasswordValidator>();
    }

    private static void ConfigureOptions(IServiceCollection services)
    {
        services.Configure<DataProtectionTokenProviderOptions>(options => { options.TokenLifespan = TimeSpan.FromHours(3); });

        services.Configure<EmailConfirmationTokenProviderOptions>(options => { options.TokenLifespan = TimeSpan.FromDays(2); });

        services.Configure<IdentityOptions>(options =>
        {
            options.Tokens.EmailConfirmationTokenProvider = "EmailConfirmation";

            // Default Lockout settings.
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;
        });

        services.Configure<PasswordHasherOptions>(_ =>
        {
            // option.IterationCount = 10000;
            // option.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2;
        });

        services.AddAuthorizationPolicies(Assembly.GetExecutingAssembly(), AuthorizationPolicyNames.GetPolicyNames());
    }

    public static void MigrateIdentityDb(this IApplicationBuilder app)
    {
        using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
        {
            serviceScope.ServiceProvider.GetRequiredService<IdentityDbContext>().Database.Migrate();
        }
    }

    public static IServiceCollection AddHostedServicesIdentityModule(this IServiceCollection services)
    {
        services.AddHostedService<SyncUsersWorker>();

        return services;
    }
}