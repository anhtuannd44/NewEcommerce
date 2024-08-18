using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductResponseDto : ActionEntityStatusDto
{
    public ProductDto Data { get; set; }
}