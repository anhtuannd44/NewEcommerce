using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Store.Api.Entities;

public class Product : BaseEntity<Guid>, IAggregateRoot
{
    public string Code { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
}
