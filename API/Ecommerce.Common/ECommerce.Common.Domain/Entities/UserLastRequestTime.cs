using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities;

public class UserLastRequestTime : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
    public DateTime? LastRequestTime { get; set; }
}