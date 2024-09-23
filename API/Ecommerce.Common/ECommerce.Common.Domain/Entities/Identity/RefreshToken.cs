namespace ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.BaseEntity;

public class RefreshToken : BaseEntity<Guid>
{
    public string Key { get; set; }

    public Guid? UserId { get; set; }

    public string ClientId { get; set; }

    public DateTime Expiration { get; set; }

    public DateTime? ConsumedTime { get; set; }

    public string TokenHash { get; set; }
    public string Scope { get; set; }
}