using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Storage.Api.Entities;

namespace ECommerce.Storage.Api.DTOs;

public class AuditLogCreatedEvent : IMessageBusEvent
{
    public AuditLogEntry AuditLog { get; set; }
}
