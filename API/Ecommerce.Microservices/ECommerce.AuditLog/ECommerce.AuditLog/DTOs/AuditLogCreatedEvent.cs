using ECommerce.AuditLog.Entities;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.AuditLog.DTOs;

public class AuditLogCreatedEvent : IMessageBusEvent
{
    public AuditLogEntry AuditLog { get; set; }
}
