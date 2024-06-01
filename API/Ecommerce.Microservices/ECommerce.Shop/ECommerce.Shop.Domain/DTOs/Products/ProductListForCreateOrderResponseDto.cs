namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductListForCreateOrderResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string SeoUrl { get; set; }
    public int Status { get; set; }
    public string Sku { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}