using System.Net.Mime;
using ECommerce.Common.CrossCuttingConcerns.Csv;
using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Models;
using ECommerce.Store.Api.Queries;
using ECommerce.Store.Api.RateLimiterPolicies;
using MediatR;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class ExportProductsAsCsvRequest : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapGet("api/products/exportascsv", HandleAsync)
        .RequireAuthorization()
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("ExportProductsAsCsv")
        .Produces(StatusCodes.Status200OK)
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new() { Name = "Products" } }
        });
    }

    private static async Task<IResult> HandleAsync(IMediator dispatcher,
        ICsvWriter<ProductModel> productCsvWriter)
    {
        var products = await dispatcher.Send(new GetProductsQuery());
        var model = products.ToModels();
        using var stream = new MemoryStream();
        productCsvWriter.Write(model, stream);
        return Results.File(stream.ToArray(), MediaTypeNames.Application.Octet, "Products.csv");
    }
}
