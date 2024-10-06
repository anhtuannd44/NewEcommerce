using System.Globalization;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Domain.Infrastructure.MessageBrokers;

public class MessageBus : IMessageBus
{
    private readonly IServiceProvider _serviceProvider;
    private static readonly List<Type> _consumers = [];
    private static readonly Dictionary<string, List<Type>> _outboxEventHandlers = new();

    internal static void AddConsumers(Assembly assembly, IServiceCollection services)
    {
        var types = assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(y => y.IsGenericType && y.GetGenericTypeDefinition() == typeof(IMessageBusConsumer<,>)))
            .ToList();

        foreach (var type in types)
        {
            services.AddTransient(type);
        }

        _consumers.AddRange(types);
    }

    internal static void AddOutboxEventPublishers(Assembly assembly, IServiceCollection services)
    {
        var types = assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(y => y == typeof(IOutBoxEventPublisher)))
            .ToList();

        foreach (var type in types)
        {
            services.AddTransient(type);
        }

        foreach (var item in types)
        {
            var canHandlerEventTypes = (string[])item.InvokeMember(nameof(IOutBoxEventPublisher.CanHandleEventTypes), BindingFlags.InvokeMethod, null, null, null,
                CultureInfo.CurrentCulture);
            var eventSource = (string)item.InvokeMember(nameof(IOutBoxEventPublisher.CanHandleEventSource), BindingFlags.InvokeMethod, null, null, null,
                CultureInfo.CurrentCulture);

            if (canHandlerEventTypes == null) continue;
            foreach (var eventType in canHandlerEventTypes)
            {
                var key = eventSource + ":" + eventType;
                if (!_outboxEventHandlers.TryGetValue(key, out var value))
                {
                    value = [];
                    _outboxEventHandlers[key] = value;
                }

                value.Add(item);
            }
        }
    }

    public MessageBus(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task SendAsync<T>(T message, MetaData metaData = null, CancellationToken cancellationToken = default)
        where T : IMessageBusMessage
    {
        await _serviceProvider.GetRequiredService<IMessageSender<T>>().SendAsync(message, metaData, cancellationToken);
    }

    public async Task ReceiveAsync<TConsumer, T>(Func<T, MetaData, Task> action, CancellationToken cancellationToken = default)
        where T : IMessageBusMessage
    {
        await _serviceProvider.GetRequiredService<IMessageReceiver<TConsumer, T>>().ReceiveAsync(action, cancellationToken);
    }

    public async Task ReceiveAsync<TConsumer, T>(CancellationToken cancellationToken = default)
        where T : IMessageBusMessage
    {
        await _serviceProvider.GetRequiredService<IMessageReceiver<TConsumer, T>>().ReceiveAsync(async (data, metaData) =>
        {
            using var scope = _serviceProvider.CreateScope();
            foreach (var handlerType in _consumers)
            {
                var canHandleEvent = handlerType.GetInterfaces()
                    .Any(x => x.IsGenericType
                              && x.GetGenericTypeDefinition() == typeof(IMessageBusConsumer<,>)
                              && x.GenericTypeArguments[0] == typeof(TConsumer) && x.GenericTypeArguments[1] == typeof(T));

                if (!canHandleEvent) continue;
                
                dynamic handler = scope.ServiceProvider.GetService(handlerType);
                
                if (handler == null)
                {
                    continue;
                }
                
                await handler.HandleAsync((dynamic)data, metaData, cancellationToken);
            }
        }, cancellationToken);
    }

    public async Task SendAsync(PublishingOutBoxEvent outbox, CancellationToken cancellationToken = default)
    {
        var key = outbox.EventSource + ":" + outbox.EventType;
        var handlerTypes = _outboxEventHandlers.GetValueOrDefault(key);

        if (handlerTypes == null)
        {
            // TODO: Take Note
            return;
        }

        foreach (var handler in handlerTypes.Select(type => _serviceProvider.GetService(type)).Where(handler => (dynamic)handler != null))
        {
            await ((dynamic)handler).HandleAsync(outbox, cancellationToken);
        }
    }
}

public static class MessageBusExtensions
{
    public static void AddMessageBusConsumers(this IServiceCollection services, Assembly assembly)
    {
        MessageBus.AddConsumers(assembly, services);
    }

    public static void AddOutboxEventPublishers(this IServiceCollection services, Assembly assembly)
    {
        MessageBus.AddOutboxEventPublishers(assembly, services);
    }

    public static void AddMessageBus(this IServiceCollection services, Assembly assembly)
    {
        services.AddTransient<IMessageBus, MessageBus>();
        services.AddMessageBusConsumers(assembly);
        services.AddOutboxEventPublishers(assembly);
    }
}