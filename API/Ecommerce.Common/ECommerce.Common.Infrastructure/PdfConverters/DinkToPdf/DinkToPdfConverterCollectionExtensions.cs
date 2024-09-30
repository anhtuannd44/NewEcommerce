using DinkToPdf;
using DinkToPdf.Contracts;
using ECommerce.Common.CrossCuttingConcerns.PdfConverter;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.PdfConverters.DinkToPdf;

public static class DinkToPdfConverterCollectionExtensions
{
    public static IServiceCollection AddDinkToPdfConverter(this IServiceCollection services)
    {
        services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
        services.AddSingleton<IPdfConverter, DinkToPdfConverter>();

        return services;
    }
}