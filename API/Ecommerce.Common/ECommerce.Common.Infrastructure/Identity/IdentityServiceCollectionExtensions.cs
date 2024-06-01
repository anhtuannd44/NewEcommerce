using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Identity;
using ECommerce.Common.Infrastructure.ConfigurationOptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.Identity;

public static class IdentityServiceCollectionExtensions
{
    public static IServiceCollection AddECommerceIdentity(this IServiceCollection services,
        AuthOptions appSettingConfiguration)
    {
        services.AddIdentityCore<User>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.User.AllowedUserNameCharacters = null!;
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.DefaultLockoutTimeSpan =
                    TimeSpan.FromMinutes(appSettingConfiguration.AccountLockoutTimeSpan);
                options.Lockout.MaxFailedAccessAttempts = appSettingConfiguration.MaxFailedAccessAttemptsBeforeLockout;
            })
            .AddRoles<Role>()
            .AddDefaultTokenProviders();

        services.Configure<PasswordHasherOptions>(option =>
        {
            option.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2;
        });

        services.AddScoped<IUserStore<User>, UserStore>();
        services.AddScoped<IRoleStore<Role>, RoleStore>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddTransient<ApplicationUserManager, ApplicationUserManager>();
        services.AddTransient<SignInManager<User>, SignInManager<User>>();

        return services;
    }
}