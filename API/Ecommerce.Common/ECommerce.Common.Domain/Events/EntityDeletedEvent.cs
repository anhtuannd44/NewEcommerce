using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Events;

public class EntityDeletedEvent<T> : IDomainEvent
    where T : BaseEntity<Guid>
{
    public EntityDeletedEvent(T entity, DateTime eventDateTime)
    {
        Entity = entity;
        EventDateTime = eventDateTime;
    }

    public T Entity { get; }

    public DateTime EventDateTime { get; }
}
