﻿using ECommerce.Store.Api.Repositories;
using MediatR;
using ECommerce.Common.CrossCuttingConcerns.Exceptions;

namespace ECommerce.Store.Api.Queries;

public class GetProductQuery : IRequest<Entities.Product>
{
    public Guid Id { get; set; }
    public bool ThrowNotFoundIfNull { get; set; }
}

public class GetProductQueryHandler : IRequestHandler<GetProductQuery, Entities.Product>
{
    private readonly IProductRepository _productRepository;

    public GetProductQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Entities.Product> Handle(GetProductQuery query, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.FirstOrDefaultAsync(_productRepository.GetQueryableSet().Where(x => x.Id == query.Id));

        if (query.ThrowNotFoundIfNull && product == null)
        {
            throw new NotFoundException($"Product {query.Id} not found.");
        }

        return product;
    }
}
