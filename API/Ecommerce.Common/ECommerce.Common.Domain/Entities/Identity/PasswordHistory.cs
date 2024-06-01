namespace ECommerce.Common.Domain.Entities.Identity;

public class PasswordHistory : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedDate { get; set; }
    public virtual User User { get; set; }
}