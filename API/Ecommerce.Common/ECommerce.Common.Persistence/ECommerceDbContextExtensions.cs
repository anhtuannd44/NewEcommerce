using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Persistence;

public static class ECommerceDbContextExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, string connectionString, string migrationsAssembly = "")
    {
        services.AddDbContext<ECommerceDbContext>(options => options.UseSqlServer(connectionString))
            .AddScoped<IUnitOfWork, UnitOfWork>()
            .AddScoped<IUserLastRequestTimeRepository, UserLastRequestTimeRepository>();

        return services;
    }
}