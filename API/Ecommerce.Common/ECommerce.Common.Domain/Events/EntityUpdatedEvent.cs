using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Events;

public class EntityUpdatedEvent<T> : IDomainEvent
    where T : BaseEntity<Guid>
{
    public EntityUpdatedEvent(T entity, DateTime eventDateTime)
    {
        Entity = entity;
        EventDateTime = eventDateTime;
    }

    public T Entity { get; }

    public DateTime EventDateTime { get; }
}
