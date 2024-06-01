namespace ECommerce.Common.Domain.Entities.Orders;

public class OrderAttribute : AbstractEntity
{
        public string Name { get; set; }
        public string Description { get; set; }
        
        public virtual IList<Order> Orders { get; set; }
}