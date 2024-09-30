using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Authorization;
using ECommerce.Store.Api.Models;
using ECommerce.Store.Api.Queries;
using ECommerce.Store.Api.RateLimiterPolicies;
using MediatR;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class GetProductsRequest : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapGet("api/products", HandleAsync)
        .RequireAuthorization(AuthorizationPolicyNames.GetProductsPolicy)
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("GetProducts")
        .Produces<IEnumerable<ProductModel>>(contentType: "application/json")
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new OpenApiTag { Name = "Products" } }
        });
    }

    private static async Task<IResult> HandleAsync(IMediator dispatcher,
        ILogger<GetProductsRequest> logger)
    {
        logger.LogInformation("Getting all products");
        var products = await dispatcher.Send(new GetProductsQuery());
        var model = products.ToModels();
        return Results.Ok(model);
    }
}
