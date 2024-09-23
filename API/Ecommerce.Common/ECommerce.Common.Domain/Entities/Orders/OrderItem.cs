using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Orders;

public class OrderItem : BaseEntity<Guid>, IAggregateRoot
{
    public Guid ProductId { get; set; }
    public decimal Price { get; set; }
    public DiscountType DiscountType { get; set; }
    public int Quantity { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal PreTotal { get; set; }
    public string ProductCode { get; set; }
    public decimal TotalPriceAfterDiscount { get; set; }
    public string Note { get; set; }
    public bool IsVAT { get; set; }
    public decimal VATValue { get; set; }
    public string Name { get; set; }

    public Guid OrderId { get; set; }
    public virtual Order Order { get; set; }
}