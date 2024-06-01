using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductCategoryDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string MetaTitle { get; set; }
    public string MetaKeywords { get; set; }
    public string MetaDescription { get; set; }
    public string SeoUrl { get; set; }
}

public class ProductCategoryResponseDto : ActionEntityStatusDto
{
    public ProductCategoryDto Data { get; set; }
}