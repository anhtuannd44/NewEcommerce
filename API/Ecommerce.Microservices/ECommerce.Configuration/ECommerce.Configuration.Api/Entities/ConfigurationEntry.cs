using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Configuration.Entities;

public class ConfigurationEntry : BaseEntity<Guid>, IAggregateRoot
{
    public string Key { get; set; }

    public string Value { get; set; }

    public string Description { get; set; }

    public bool IsSensitive { get; set; }
}
