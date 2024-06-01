namespace ECommerce.Common.Domain.Entities.Products;

public class ProductAttributeCombination : AbstractEntity
{
    public Guid ProductId { get; set; }
    public string AttributesJson { get; set; }
    public decimal? Price { get; set; }
    public int? StockQuantity { get; set; }
    public string Sku { get; set; }
    public string BarCode { get; set; }
    public decimal? ProductCost { get; set; }

    public virtual Product Product { get; set; }
}