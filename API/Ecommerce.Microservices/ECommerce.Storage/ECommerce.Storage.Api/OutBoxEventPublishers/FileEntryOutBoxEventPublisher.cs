﻿using ECommerce.Storage.Api.Commands;
using ECommerce.Storage.Api.Constants;
using ECommerce.Storage.Api.DTOs;
using ECommerce.Storage.Api.Entities;
using System.Text.Json;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Storage.Api.OutBoxEventPublishers;

public class FileEntryOutBoxEventPublisher : IOutBoxEventPublisher
{
    private readonly IMessageBus _messageBus;

    public static string[] CanHandleEventTypes()
    {
        return new string[] { EventTypeConstants.FileEntryCreated, EventTypeConstants.FileEntryDeleted };
    }

    public static string CanHandleEventSource()
    {
        return typeof(PublishEventsCommand).Assembly.GetName().Name;
    }

    public FileEntryOutBoxEventPublisher(IMessageBus messageBus)
    {
        _messageBus = messageBus;
    }

    public async Task HandleAsync(PublishingOutBoxEvent outbox, CancellationToken cancellationToken = default)
    {
        switch (outbox.EventType)
        {
            case EventTypeConstants.FileEntryCreated:
                await _messageBus.SendAsync(new FileUploadedEvent { FileEntry = JsonSerializer.Deserialize<FileEntry>(outbox.Payload) }, cancellationToken: cancellationToken);
                break;
            case EventTypeConstants.FileEntryDeleted:
                await _messageBus.SendAsync(new FileDeletedEvent { FileEntry = JsonSerializer.Deserialize<FileEntry>(outbox.Payload) }, cancellationToken: cancellationToken);
                break;
        }
    }
}