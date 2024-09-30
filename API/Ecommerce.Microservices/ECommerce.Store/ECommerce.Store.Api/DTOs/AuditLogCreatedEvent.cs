using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Store.Api.Entities;

namespace ECommerce.Store.Api.DTOs;

public class AuditLogCreatedEvent : IMessageBusEvent
{
    public AuditLogEntry AuditLog { get; set; }
}
