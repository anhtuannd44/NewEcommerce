using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Authorization;
using ECommerce.Store.Api.Models;
using ECommerce.Store.Api.Queries;
using ECommerce.Store.Api.RateLimiterPolicies;
using MediatR;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class GetProductRequest : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapGet("api/products/{id}", HandleAsync)
        .RequireAuthorization(AuthorizationPolicyNames.GetProductPolicy)
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("GetProduct")
        .Produces<ProductModel>(contentType: "application/json")
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new OpenApiTag { Name = "Products" } }
        });
    }

    private static async Task<IResult> HandleAsync(IMediator dispatcher, Guid id)
    {
        var product = await dispatcher.Send(new GetProductQuery { Id = id, ThrowNotFoundIfNull = true });
        var model = product.ToModel();
        return Results.Ok(model);
    }
}
