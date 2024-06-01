using ECommerce.Common.Domain.Enum;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
    public string Body { get; set; }
    public string ShortDescription { get; set; }
    public bool AllowComments { get; set; }
    public string MetaTitle { get; set; }
    public string MetaKeywords { get; set; }
    public string MetaDescription { get; set; }
    public string SeoUrl { get; set; }
    public string Unit { get; set; }
    public int Status { get; set; }
    public string[] Tags { get; set; }
    public int ProductType { get; set; }
    public bool AllowCustomerReviews { get; set; }
    public string Sku { get; set; }
    public string BarCode { get; set; }
    public bool ManageStockQuantity { get; set; }
    public int? StockQuantity { get; set; }
    public bool CallForPrice { get; set; }
    public decimal? Price { get; set; }
    public decimal? ProductCost { get; set; }
    public Guid? BrandId { get; set; }
    public Guid? ProductCategoryId { get; set; }
    public ProductPictureDto MainPicture { get; set; }
    public List<ProductPictureDto> Album { get; set; } = [];
    public List<ProductAttributeDto> ProductAttributes { get; set; }
    public List<ProductAttributeCombinationDto> ProductAttributeCombinations { get; set; }
}

public class ProductAttributeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<string> ProductAttributeValues { get; set; }
}