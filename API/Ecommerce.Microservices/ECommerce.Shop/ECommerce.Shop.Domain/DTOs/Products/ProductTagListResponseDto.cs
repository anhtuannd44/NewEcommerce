using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class BrandListResponseDto : ActionEntityStatusDto
{
    public List<BrandDto> Data { get; set; }
}