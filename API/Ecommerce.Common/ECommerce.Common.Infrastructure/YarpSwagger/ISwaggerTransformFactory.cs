using Microsoft.OpenApi.Models;

namespace ECommerce.Common.Infrastructure.YarpSwagger;

public interface ISwaggerTransformFactory
{
    bool Build(OpenApiOperation operation, IReadOnlyDictionary<string, string> transformValues);
}