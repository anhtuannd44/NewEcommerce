using ECommerce.Storage.Api.Commands;
using ECommerce.Storage.Api.Constants;
using ECommerce.Storage.Api.DTOs;
using ECommerce.Storage.Api.Entities;
using System.Text.Json;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Storage.Api.OutBoxEventPublishers;

public class AuditLogEntryOutBoxEventPublisher : IOutBoxEventPublisher
{
    private readonly IMessageBus _messageBus;

    public static string[] CanHandleEventTypes()
    {
        return new string[] { EventTypeConstants.AuditLogEntryCreated };
    }

    public static string CanHandleEventSource()
    {
        return typeof(PublishEventsCommand).Assembly.GetName().Name;
    }

    public AuditLogEntryOutBoxEventPublisher(IMessageBus messageBus)
    {
        _messageBus = messageBus;
    }

    public async Task HandleAsync(PublishingOutBoxEvent outbox, CancellationToken cancellationToken = default)
    {
        if (outbox.EventType == EventTypeConstants.AuditLogEntryCreated)
        {
            var logEntry = JsonSerializer.Deserialize<AuditLogEntry>(outbox.Payload);
            await _messageBus.SendAsync(new AuditLogCreatedEvent { AuditLog = logEntry },
                new MetaData
                {
                    MessageId = outbox.Id,
                }, cancellationToken);
        }
    }
}