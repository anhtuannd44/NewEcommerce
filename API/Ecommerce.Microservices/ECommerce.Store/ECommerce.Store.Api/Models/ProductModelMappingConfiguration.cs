﻿using ECommerce.Store.Api.Entities;

namespace ECommerce.Store.Api.Models;

public static class ProductModelMappingConfiguration
{
    public static IEnumerable<ProductModel> ToModels(this IEnumerable<Product> entities)
    {
        return entities.Select(x => x.ToModel());
    }

    public static ProductModel ToModel(this Product entity)
    {
        return entity == null ? null : new ProductModel
        {
            Id = entity.Id,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
        };
    }

    public static Product ToEntity(this ProductModel model)
    {
        return new Product
        {
            Id = model.Id,
            Code = model.Code,
            Name = model.Name,
            Description = model.Description,
        };
    }
}