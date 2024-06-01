namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductCategoryListResponseDto
{
    public List<ProductCategoryInListCategoryViewResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class ProductCategoryInListCategoryViewResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string SeoUrl { get; set; }
}