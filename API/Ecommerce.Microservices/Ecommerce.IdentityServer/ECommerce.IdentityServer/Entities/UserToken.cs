using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.IdentityServer.Entities;

public class UserToken : BaseEntity<Guid>
{
    public Guid UserId { get; set; }

    public string LoginProvider { get; set; }

    public string TokenName { get; set; }

    public string TokenValue { get; set; }
}
