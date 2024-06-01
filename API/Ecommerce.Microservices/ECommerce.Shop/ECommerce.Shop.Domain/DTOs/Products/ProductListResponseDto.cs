namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductListResponseDto
{
    public List<ProductInListResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class ProductInListResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string BodyOverview { get; set; }
    public string SeoUrl { get; set; }
    public int Status { get; set; }
    public string Sku { get; set; }
    public string BarCode { get; set; }
    public decimal? Price { get; set; }
    public bool ManageStockQuantity { get; set; }
    public int? StockQuantity { get; set; }
    public ProductFileResponseDto MainPicture { get; set; }
    public List<ProductFileResponseDto> Album { get; set; }
    public ProductAuthorDto Author { get; set; }
    public ProductCategoryInListProductViewResponseDto ProductCategory { get; set; }
}

public class ProductFileResponseDto
{
    public Guid FileId { get; set; }
    public string VirtualPath { get; set; }
}

public class ProductCategoryInListProductViewResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string SeoUrl { get; set; }
}

public class ProductAuthorDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
}