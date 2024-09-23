using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.Common.Domain.Entities.Orders;

public class ResponsibleStaff: BaseEntity<Guid>, IAggregateRoot
{
    public Guid OrderId { get; set; }
    public Guid UserId { get; set; }
    
    public virtual Order Order { get; set; }
    public virtual User User { get; set; }
}