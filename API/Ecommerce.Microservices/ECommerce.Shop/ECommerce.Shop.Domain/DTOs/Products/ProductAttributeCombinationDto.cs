namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductAttributeCombinationDto
{
   public decimal? Price { get; set; }
   public int? StockQuantity { get; set; }
   public string Sku { get; set; }
   public string BarCode { get; set; }
   public decimal? ProductCost { get; set; }
   public List<AttributesJsonDto> AttributeJson { get; set; }
}

public class AttributesJsonDto
{
   public Guid ProductAttributeId { get; set; }
   public string ProductAttributeValue { get; set; }
}