using System;
using System.Collections.Generic;
using ECommerce.Common.Infrastructure.YarpSwagger;
using Microsoft.OpenApi.Models;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace Ecommerce.Gateways.WebAPI.Transformations;

public class HeaderTransformFactory : ITransformFactory, ISwaggerTransformFactory
{
    /// <summary>
    /// Property validates for header titel rename
    /// </summary>
    /// <param name="context"></param>
    /// <param name="transformValues"></param>
    /// <returns></returns>
    public bool Validate(TransformRouteValidationContext context, IReadOnlyDictionary<string, string> transformValues)
    {
        if (!transformValues.TryGetValue("RenameHeader", out var header)) return false;

        if (string.IsNullOrEmpty(header))
        {
            context.Errors.Add(new ArgumentException("A non-empty RenameHeader value is required"));
        }

        if (transformValues.TryGetValue("Set", out var newHeader))
        {
            if (string.IsNullOrEmpty(newHeader))
            {
                context.Errors.Add(new ArgumentException("A non-empty Set value is required"));
            }
        }
        else
        {
            context.Errors.Add(new ArgumentException("Set option is required"));
        }

        return true;
    }

    /// <summary>
    /// Header title rename transformation
    /// </summary>
    /// <param name="context"></param>
    /// <param name="transformValues"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public bool Build(TransformBuilderContext context, IReadOnlyDictionary<string, string> transformValues)
    {
        if (!transformValues.TryGetValue("RenameHeader", out var header)) return false;
        if (string.IsNullOrEmpty(header))
        {
            throw new ArgumentException("A non-empty RenameHeader value is required");
        }

        if (transformValues.TryGetValue("Set", out var newHeader))
        {
            if (string.IsNullOrEmpty(newHeader))
            {
                throw new ArgumentException("A non-empty Set value is required");
            }
        }
        else
        {
            throw new ArgumentException("Set option is required");
        }

        context.AddRequestTransform(transformContext =>
        {
            if (!transformContext.ProxyRequest.Headers.TryGetValues(header, out var headerValue)) return default;
            // Remove the original header
            transformContext.ProxyRequest.Headers.Remove(header);

            // Add a new header with the same value(s) as the original header
            transformContext.ProxyRequest.Headers.Add(newHeader, headerValue);

            return default;
        });

        return true;
    }

    /// <summary>
    /// Header title rename transformation for Swagger
    /// </summary>
    /// <param name="operation"></param>
    /// <param name="transformValues"></param>
    /// <returns></returns>
    public bool Build(OpenApiOperation operation, IReadOnlyDictionary<string, string> transformValues)
    {
        if (!transformValues.ContainsKey("RenameHeader")) return false;
        foreach (var parameter in operation.Parameters)
        {
            if (!parameter.In.HasValue || !parameter.In.Value.ToString().Equals("Header")) continue;
            if (!transformValues.TryGetValue("RenameHeader", out var header)
                || !transformValues.TryGetValue("Set", out var newHeader)) continue;
            if (parameter.Name == newHeader)
            {
                parameter.Name = header;
            }
        }

        return true;

    }
}