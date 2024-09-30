using System.Net.Mime;
using ECommerce.Common.CrossCuttingConcerns.HtmlGenerator;
using ECommerce.Common.CrossCuttingConcerns.PdfConverter;
using ECommerce.Common.Infrastructure.Web.MinimalApis;
using ECommerce.Store.Api.Models;
using ECommerce.Store.Api.Queries;
using ECommerce.Store.Api.RateLimiterPolicies;
using MediatR;
using Microsoft.OpenApi.Models;

namespace ECommerce.Store.Api.Endpoints;

public class ExportProductsAsPdfRequest : IEndpointHandler
{
    public static void MapEndpoint(IEndpointRouteBuilder builder)
    {
        builder.MapGet("api/products/exportaspdf", HandleAsync)
        .RequireAuthorization()
        .RequireRateLimiting(RateLimiterPolicyNames.DefaultPolicy)
        .WithName("ExportProductsAsPdf")
        .Produces(StatusCodes.Status200OK)
        .WithOpenApi(operation => new OpenApiOperation(operation)
        {
            Tags = new List<OpenApiTag> { new OpenApiTag { Name = "Products" } }
        });
    }

    private static async Task<IResult> HandleAsync(IMediator dispatcher,
        IHtmlGenerator htmlGenerator,
        IPdfConverter pdfConverter)
    {
        var products = await dispatcher.Send(new GetProductsQuery());
        var model = products.ToModels();

        var template = Path.Combine(Environment.CurrentDirectory, $"Templates/ProductList.cshtml");
        var html = await htmlGenerator.GenerateAsync(template, model);
        var pdf = await pdfConverter.ConvertAsync(html);

        return Results.File(pdf, MediaTypeNames.Application.Octet, "Products.pdf");
    }
}
