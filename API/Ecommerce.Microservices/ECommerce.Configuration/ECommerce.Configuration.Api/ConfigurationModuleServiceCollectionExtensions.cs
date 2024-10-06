using System.Reflection;
using ECommerce.Common.Application;
using ECommerce.Common.CrossCuttingConcerns.Excel;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.Web.Authorization.Policies;
using ECommerce.Configuration.Authorization;
using ECommerce.Configuration.ConfigurationOptions;
using ECommerce.Configuration.Entities;
using ECommerce.Configuration.Excel.ClosedXML;
using ECommerce.Configuration.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Configuration;

public static class ConfigurationModuleServiceCollectionExtensions
{
    public static void AddConfigurationModule(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddDbContext<ConfigurationDbContext>(options => options.UseSqlServer(appSettings.ConnectionStrings.ECommerce, sql =>
        {
            if (!string.IsNullOrEmpty(appSettings.ConnectionStrings.MigrationsAssembly))
            {
                sql.MigrationsAssembly(appSettings.ConnectionStrings.MigrationsAssembly);
            }
        }))
            .AddScoped<IRepository<ConfigurationEntry, Guid>, Repository<ConfigurationEntry, Guid>>();

        services.AddMessageHandlers(Assembly.GetExecutingAssembly());

        services.AddAuthorizationPolicies(Assembly.GetExecutingAssembly(), AuthorizationPolicyNames.GetPolicyNames());

        services.AddScoped<IExcelReader<List<ConfigurationEntry>>, ConfigurationEntryExcelReader>();
        services.AddScoped<IExcelWriter<List<ConfigurationEntry>>, ConfigurationEntryExcelWriter>();
    }

    public static IMvcBuilder AddConfigurationModule(this IMvcBuilder builder)
    {
        return builder.AddApplicationPart(Assembly.GetExecutingAssembly());
    }

    public static void MigrateConfigurationDb(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
        serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>().Database.Migrate();
    }
}
