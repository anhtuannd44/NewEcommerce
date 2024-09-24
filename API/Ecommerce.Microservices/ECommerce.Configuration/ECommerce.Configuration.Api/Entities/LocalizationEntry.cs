using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Configuration.Entities;

public class LocalizationEntry : BaseEntity<Guid>, IAggregateRoot
{
    public string Name { get; set; }

    public string Value { get; set; }

    public string Culture { get; set; }

    public string Description { get; set; }
}
