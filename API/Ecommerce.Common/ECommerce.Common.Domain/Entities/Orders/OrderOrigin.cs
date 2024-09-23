using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities.Orders;

public class OrderOrigin : BaseEntity<Guid>, IAggregateRoot
{
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        
        public virtual IList<Order> Orders { get; set; }
}