using ECommerce.Shop.Application.Services;
using ECommerce.Shop.Domain.IService;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Shop.Application;

public static class ShopApplicationExtensions
{
    public static IServiceCollection AddApplicationShopServices(this IServiceCollection services)
    {
        services.AddScoped<IBlogService, BlogService>()
            .AddScoped<IBlogCategoryService, BlogCategoryService>()
            .AddScoped<IProductService, ProductService>()
            .AddScoped<IProductCategoryService, ProductCategoryService>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IOrderService, OrderService>()
            .AddScoped<IEmailSenderService, EmailSenderService>()
            .AddScoped<IFileService, FileService>();
        return services;
    }
}