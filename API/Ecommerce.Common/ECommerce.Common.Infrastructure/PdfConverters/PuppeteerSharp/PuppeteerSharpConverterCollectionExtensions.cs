using ECommerce.Common.CrossCuttingConcerns.PdfConverter;
using Microsoft.Extensions.DependencyInjection;
using PuppeteerSharp;

namespace ECommerce.Common.Infrastructure.PdfConverters.PuppeteerSharp;

public static class PuppeteerSharpConverterCollectionExtensions
{
    public static IServiceCollection AddPuppeteerSharpPdfConverter(this IServiceCollection services)
    {
        var browserFetcher = new BrowserFetcher();
        browserFetcher.DownloadAsync().GetAwaiter().GetResult();

        services.AddSingleton<IPdfConverter, PuppeteerSharpConverter>();

        return services;
    }
}
