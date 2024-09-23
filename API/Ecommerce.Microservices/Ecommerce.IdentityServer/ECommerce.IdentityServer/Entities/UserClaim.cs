using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.IdentityServer.Entities;

public class UserClaim : BaseEntity<Guid>
{
    public string Type { get; set; }
    public string Value { get; set; }

    public User User { get; set; }
}
