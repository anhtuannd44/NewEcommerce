using System.Collections;
using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Orders;

public class Order : BaseEntity<Guid>, IAggregateRoot
{
        /// <summary>
        /// Format: Year+Date
        /// </summary>
        public string OrderCode { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime DateAcceptance { get; set; }
        public DateTime? DateAppointedDelivery { get; set; }
        public DateTime? DateDelivery { get; set; }
        public DateTime? DateActualDelivery { get; set; }
        public Guid? OrderAttributeId { get; set; }
        public Guid? OrderOriginId { get; set; }
        public string Note { get; set; }
        public string Tags { get; set; }
        
        public Guid? PicStaffId { get; set; }
        
        // Price Information
        public decimal PreTotal { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal ShippingFee { get; set; }
        public DiscountType DiscountType { get; set; }
        public string DiscountNote { get; set; }
        public decimal Deposit { get; set; }
        public decimal TotalPriceAfterDiscount { get; set; }
        
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
        public decimal FixingCost { get; set; }
        
        public virtual IList<OrderItem> OrderItems { get; set; }
        public virtual OrderOrigin OrderOrigin { get; set; }
        public virtual OrderAttribute OrderType { get; set; }
        public virtual IList<ConstructionStaff> ConstructionStaffs { get; set; }
        public virtual IList<ResponsibleStaff> ResponsibleStaffs { get; set; }
}