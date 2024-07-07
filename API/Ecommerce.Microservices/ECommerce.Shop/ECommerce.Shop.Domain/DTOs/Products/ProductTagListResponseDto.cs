using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductTagListResponseDto : ActionEntityStatusDto
{
    public List<string> Data { get; set; }
}