using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ECommerce.Common.Infrastructure.Logging;
using Ecommerce.Gateways.WebAPI.ConfigurationOptions;
using Ecommerce.Gateways.WebAPI.HttpMessageHandlers;
using Microsoft.AspNetCore.Builder;
using Ocelot.Configuration.File;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;
var configuration = builder.Configuration;

builder.WebHost.UseECommerceLogger(configuration =>
{
    return new LoggingOptions();
});

var appSettings = new AppSettings();
configuration.Bind(appSettings);


services.AddOcelot()
    .AddDelegatingHandler<DebuggingHandler>(true);

services.PostConfigure<FileConfiguration>(fileConfiguration =>
{
    foreach (var route in appSettings.Ocelot.Routes.Select(x => x.Value))
    {
        var uri = new Uri(route.Downstream);

        foreach (var pathTemplate in route.UpstreamPathTemplates)
        {

            fileConfiguration.Routes.Add(new FileRoute
            {
                UpstreamPathTemplate = pathTemplate,
                DownstreamPathTemplate = pathTemplate,
                DownstreamScheme = uri.Scheme,
                DownstreamHostAndPorts = new List<FileHostAndPort>
                {
                    new FileHostAndPort{ Host = uri.Host, Port = uri.Port }
                }
            });
        }
    }

    foreach (var route in fileConfiguration.Routes)
    {
        if (string.IsNullOrWhiteSpace(route.DownstreamScheme))
        {
            route.DownstreamScheme = appSettings?.Ocelot?.DefaultDownstreamScheme;
        }

        if (string.IsNullOrWhiteSpace(route.DownstreamPathTemplate))
        {
            route.DownstreamPathTemplate = route.UpstreamPathTemplate;
        }
    }
});

services.AddReverseProxy().LoadFromConfig(configuration.GetSection("Yarp"));

// Configure the HTTP request pipeline.
var app = builder.Build();

switch (appSettings.ProxyProvider)
{
    case "Ocelot":
        app.UseWebSockets();
        await app.UseOcelot();
        break;
    case "Yarp":
        app.MapReverseProxy();
        break;
}

app.Run();
