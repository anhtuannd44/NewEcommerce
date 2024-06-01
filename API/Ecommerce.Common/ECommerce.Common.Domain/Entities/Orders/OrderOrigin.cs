namespace ECommerce.Common.Domain.Entities.Orders;

public class OrderOrigin : AbstractEntity
{
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        
        public virtual IList<Order> Orders { get; set; }
}