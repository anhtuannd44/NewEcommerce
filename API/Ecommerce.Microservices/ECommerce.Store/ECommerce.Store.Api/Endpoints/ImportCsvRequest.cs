using ECommerce.Common.CrossCuttingConcerns.Csv;
using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Models;
using ECommerce.Store.Api.RateLimiterPolicies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class ImportCsvRequest
{
    public IFormFile FormFile { get; set; }
}

public class ImportCsvRequestHandler : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapPost("api/products/importcsv", HandleAsync)
        .RequireAuthorization()
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("ImportCsv")
        .Produces<CreateProductResponse>(StatusCodes.Status200OK, contentType: "application/json")
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new OpenApiTag { Name = "Products" } }
        })
        .DisableAntiforgery();
    }

    private static Task<IResult> HandleAsync(ICsvReader<ProductModel> productCsvReader, [FromForm] ImportCsvRequest request)
    {
        using var stream = request.FormFile.OpenReadStream();
        var products = productCsvReader.Read(stream);

        // TODO: import to database
        return Task.FromResult(Results.Ok(products));
    }
}