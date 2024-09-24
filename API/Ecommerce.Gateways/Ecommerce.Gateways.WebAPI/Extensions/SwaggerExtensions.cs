using ECommerce.Common.Infrastructure.YarpSwagger;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Ecommerce.Gateways.WebAPI.Extensions;

public static class SwaggerExtensions
{
    public static void ConfigureSwaggerEndpoints(
        this SwaggerUIOptions options,
        ReverseProxyDocumentFilterConfig config
    )
    {
        if (config.Swagger.IsCommonDocument)
        {
            var name = config.Swagger.CommonDocumentName;
            options.SwaggerEndpoint($"/swagger/{name}/swagger.json", name);
        }
        else
        {
            foreach (var cluster in config.Clusters)
            {
                var name = cluster.Key;
                options.SwaggerEndpoint($"/swagger/{name}/swagger.json", name);
            }
        }
    }
    
    public static void ConfigureSwaggerDocs(
        this SwaggerGenOptions options,
        ReverseProxyDocumentFilterConfig config
    )
    {
        if (config.Swagger.IsCommonDocument)
        {
            var name = config.Swagger.CommonDocumentName;
            options.SwaggerDoc(name, new OpenApiInfo {Title = name, Version = name});
        }
        else
        {
            foreach (var cluster in config.Clusters)
            {
                var name = cluster.Key;
                options.SwaggerDoc(name, new OpenApiInfo {Title = name, Version = name});
            }
        }
    }
}