﻿using ECommerce.IdentityServer.ConfigurationOptions;
using ECommerce.Infrastructure.Logging;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ECommerce.IdentityServer;

public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseECommerceLogger(configuration =>
            {
                var appSettings = new AppSettings();
                configuration.Bind(appSettings);
                return appSettings.Logging;
            });
}
