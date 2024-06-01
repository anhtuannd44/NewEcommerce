using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.Common.Domain.Entities.Orders;

public class ConstructionStaff: AbstractEntity
{
    public Guid OrderId { get; set; }
    public Guid UserId { get; set; }
    
    public virtual Order Order { get; set; }
    public virtual User User { get; set; }
}