using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Orders;

public class OrderItem : AbstractEntity
{
    public string OrderItemCode { get; set; }

    public string ShortDescription { get; set; }

    public Guid ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal PreTotal { get; set; }
    public decimal PriceAfterDiscount { get; set; }
    public decimal OriginalProductCost { get; set; }
    
    public decimal DiscountValue { get; set; }
    public DiscountType DiscountType { get; set; }
    
    public string Note { get; set; }
    
    public Guid OrderId { get; set; }

    public virtual Order Order { get; set; }
}