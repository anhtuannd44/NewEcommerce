using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class CreateOrUpdateProductResponseDto : ActionEntityStatusDto
{
    public ProductDto Data { get; set; }
}