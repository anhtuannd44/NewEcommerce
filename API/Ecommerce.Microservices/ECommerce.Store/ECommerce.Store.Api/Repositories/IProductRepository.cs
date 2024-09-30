using ECommerce.Common.Domain.IRepositories;
using ECommerce.Store.Api.Entities;

namespace ECommerce.Store.Api.Repositories;

public interface IProductRepository : IRepository<Product, Guid>;
