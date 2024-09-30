using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Authorization;
using ECommerce.Store.Api.Commands;
using ECommerce.Store.Api.Queries;
using ECommerce.Store.Api.RateLimiterPolicies;
using MediatR;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class DeleteProductRequest : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapDelete("api/products/{id:guid}", HandleAsync)
        .RequireAuthorization(AuthorizationPolicyNames.DeleteProductPolicy)
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("DeleteProduct")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new OpenApiTag { Name = "Products" } }
        });
    }

    private static async Task<IResult> HandleAsync(IMediator dispatcher, Guid id)
    {
        var product = await dispatcher.Send(new GetProductQuery { Id = id, ThrowNotFoundIfNull = true });

        await dispatcher.Send(new DeleteProductCommand { Product = product });

        return Results.Ok();
    }
}
