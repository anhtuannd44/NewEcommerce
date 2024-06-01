using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Shop.Application.ConfigurationOptions;
using Microsoft.AspNetCore;

namespace ECommerce.Shop.Web;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
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