using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Storage.Api.Entities;

public class AuditLogEntry : BaseEntity<Guid>, IAggregateRoot
{
    public Guid UserId { get; set; }

    public string Action { get; set; }

    public string ObjectId { get; set; }

    public string Log { get; set; }
}
