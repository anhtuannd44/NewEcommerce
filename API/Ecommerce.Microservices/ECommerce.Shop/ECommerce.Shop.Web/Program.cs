using ECommerce.Common.Infrastructure.ConfigurationOptions;
using ECommerce.Common.Infrastructure.Files;
using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Web;
using Microsoft.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(ConfigurationDefaults.AppSettingsFilePath, true, true);
if (!string.IsNullOrEmpty(builder.Environment?.EnvironmentName))
{
    var path = string.Format(ConfigurationDefaults.AppSettingsEnvironmentFilePath, builder.Environment.EnvironmentName);
    builder.Configuration.AddJsonFile(path, true, true);
}

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
var services = builder.Services;
var configuration = builder.Configuration;


builder.WebHost.UseEcommerceLogger(_ => new LoggingOptions());

var appSettings = new AppSettings();
configuration.Bind(appSettings);

appSettings.ConnectionStrings.MigrationsAssembly = Assembly.GetExecutingAssembly().GetName().Name;

//load application settings
builder.Services.ConfigureApplicationSettings(builder);

builder.Host.UseDefaultServiceProvider(options =>
{
    //we don't validate the scopes, since at the app start and the initial configuration we need 
    //to resolve some services (registered as "scoped") through the root container
    options.ValidateScopes = false;
    options.ValidateOnBuild = true;
});


public class Program
{
    public static void Main(string[] args)
    {
        builder.Configuration.builder.Build().Run();
    }

    private static IWebHostBuilder CreateHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseEcommerceLogger(configuration =>
            {
                var appSettings = new AppSettingConfiguration();
                configuration.Bind(appSettings);
                return appSettings.Logging;
            });
}