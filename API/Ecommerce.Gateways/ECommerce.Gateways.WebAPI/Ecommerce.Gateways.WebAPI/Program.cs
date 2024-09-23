using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Common.Infrastructure.YarpSwagger;
using ECommerce.Common.Infrastructure.YarpSwagger.Extensions;
using Ecommerce.Gateways.WebAPI.ConfigurationOptions;
using Ecommerce.Gateways.WebAPI.Extensions;
using Ecommerce.Gateways.WebAPI.Transformations;
using Ecommerce.Gateways.WebAPI.YarpConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Ocelot.Middleware;
using Swashbuckle.AspNetCore.SwaggerGen;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;
var configuration = builder.Configuration;

builder.WebHost.UseECommerceLogger(_ => new LoggingOptions());

services.AddEndpointsApiExplorer();

var appSettings = new AppSettings();
configuration.Bind(appSettings);

services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
services.AddSwaggerGen();

var yarpConfiguration = configuration.GetSection("Yarp");

services.AddReverseProxy().LoadFromConfig(yarpConfiguration).AddTransformFactory<HeaderTransformFactory>()
    .AddSwagger(yarpConfiguration);

// Configure the HTTP request pipeline.
var app = builder.Build();

switch (appSettings.ProxyProvider)
{
    case "Ocelot":
        app.UseWebSockets();
        await app.UseOcelot();
        break;
    case "Yarp":
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            var config = app.Services.GetRequiredService<IOptionsMonitor<ReverseProxyDocumentFilterConfig>>().CurrentValue;
            options.ConfigureSwaggerEndpoints(config);
        });
        app.UseHttpsRedirection();
        app.MapReverseProxy();
        break;
}

app.Run();