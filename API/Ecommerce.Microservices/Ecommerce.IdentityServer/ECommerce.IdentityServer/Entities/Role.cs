using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.IdentityServer.Entities;

public class Role : BaseEntity<Guid>, IAggregateRoot
{
    public virtual string Name { get; set; }

    public virtual string NormalizedName { get; set; }

    public virtual string ConcurrencyStamp { get; set; }

    public IList<RoleClaim> Claims { get; set; }

    public IList<UserRole> UserRoles { get; set; }
}
