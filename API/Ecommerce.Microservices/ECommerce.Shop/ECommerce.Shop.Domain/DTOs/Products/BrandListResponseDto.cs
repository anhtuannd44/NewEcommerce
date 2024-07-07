using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class BrandDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
}

public class BrandResponseDto : ActionEntityStatusDto
{
    public BrandDto Data { get; set; }
}