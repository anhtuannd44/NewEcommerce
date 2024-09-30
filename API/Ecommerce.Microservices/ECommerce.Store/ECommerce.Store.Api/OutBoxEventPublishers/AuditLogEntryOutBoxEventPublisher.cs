using System.Text.Json;
using Dapr.Client;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Store.Api.Commands;
using ECommerce.Store.Api.Constants;
using ECommerce.Store.Api.DTOs;
using ECommerce.Store.Api.Entities;

namespace ECommerce.Store.Api.OutBoxEventPublishers;

public class AuditLogEntryOutBoxEventPublisher : IOutBoxEventPublisher
{
    private readonly IMessageBus _messageBus;
    private readonly DaprClient _daprClient;

    public static string[] CanHandleEventTypes()
    {
        return new string[] { EventTypeConstants.AuditLogEntryCreated };
    }

    public static string CanHandleEventSource()
    {
        return typeof(PublishEventsCommand).Assembly.GetName().Name;
    }

    public AuditLogEntryOutBoxEventPublisher(IMessageBus messageBus,
        DaprClient daprClient)
    {
        _messageBus = messageBus;
        _daprClient = daprClient;
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

            if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("DAPR_HTTP_PORT")))
            {
                await _daprClient.PublishEventAsync("pubsub", "AuditLogCreatedEvent", new AuditLogCreatedEvent { AuditLog = logEntry }, cancellationToken);
            }
        }
    }
}