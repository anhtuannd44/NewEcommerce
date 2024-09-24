using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.AuditLog.Entities;

public class IdempotentRequest : BaseEntity<Guid>, IAggregateRoot
{
    public string RequestType { get; set; }

    public string RequestId { get; set; }
}
