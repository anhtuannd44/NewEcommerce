namespace ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

public class PasswordHistory : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedDate { get; set; }
    public virtual User User { get; set; }
}