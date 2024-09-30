using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Store.Api.Entities;

public class OutboxEvent : OutboxEventBase, IAggregateRoot
{
}

public class ArchivedOutboxEvent : OutboxEventBase, IAggregateRoot
{
}

public abstract class OutboxEventBase : BaseEntity<Guid>
{
    public string EventType { get; set; }

    public Guid TriggeredById { get; set; }

    public string ObjectId { get; set; }

    public string Message { get; set; }

    public bool Published { get; set; }
}
