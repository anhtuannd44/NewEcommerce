﻿using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECommerce.Common.Infrastructure.HostedServices;

public sealed class MessageBusConsumerBackgroundService<TConsumer, T> : BackgroundService
    where T : IMessageBusEvent
{
    private readonly ILogger<MessageBusConsumerBackgroundService<TConsumer, T>> _logger;
    private readonly IMessageBus _messageBus;

    public MessageBusConsumerBackgroundService(ILogger<MessageBusConsumerBackgroundService<TConsumer, T>> logger,
        IMessageBus messageBus)
    {
        _logger = logger;
        _messageBus = messageBus;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _messageBus.ReceiveAsync<TConsumer, T>(stoppingToken);
        return Task.CompletedTask;
    }
}
