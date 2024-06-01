using ECommerce.Common.Domain.Enum;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class OrderDetailDto
{
    public Guid Id { get; set; }
    public string OrderCode { get; set; }
    public int? Status { get; set; }
    public DateTime? DateAcceptance { get; set; }
    public DateTime? DateAppointedDelivery { get; set; }
    public DateTime? DateDelivery { get; set; }
    public DateTime? DateActualDelivery { get; set; }
    public Guid? OrderAttributeId { get; set; }
    public Guid? OrderOriginId { get; set; }
    public string Note { get; set; }
    public string[] Tags { get; set; } = [];

    public Guid? PicStaffId { get; set; }
    public List<Guid> ConstructionStaffIds { get; set; } = [];

    // Price Information
    public decimal PreTotal { get; set; }
    public decimal DiscountValue { get; set; }
    public int DiscountType { get; set; }
    public string DiscountNote { get; set; }
    public decimal Deposit { get; set; }
    public decimal TotalPriceAfterDiscount { get; set; }
    public decimal ShippingFee { get; set; }

    // Customer information
    public string CustomerName { get; set; }
    public string CustomerPhoneNumber { get; set; }
    public string DeliveryAddress { get; set; }
    public string BillingAddress { get; set; }
    public string CustomerNote { get; set; }
    public string CustomerEmail { get; set; }
    public Guid? CustomerId { get; set; }

    // Customer complain
    public bool IsComplain { get; set; }
    public string Problem { get; set; }
    public string RootCause { get; set; }
    public string Solution { get; set; }
    public List<Guid> ResponsibleStaffIds { get; set; } = [];
    public List<OrderItemDto> Items { get; set; } = [];
}

public class OrderItemDto
{
    public Guid? Id { get; set; }
    public Guid? ProductId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public string Note { get; set; }
}