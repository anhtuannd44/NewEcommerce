using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Infrastructure.MessageBrokers.AzureEventGrid;
using ECommerce.Common.Infrastructure.MessageBrokers.AzureEventHub;
using ECommerce.Common.Infrastructure.MessageBrokers.AzureQueue;
using ECommerce.Common.Infrastructure.MessageBrokers.AzureServiceBus;
using ECommerce.Common.Infrastructure.MessageBrokers.Fake;
using ECommerce.Common.Infrastructure.MessageBrokers.Kafka;
using ECommerce.Common.Infrastructure.MessageBrokers.RabbitMQ;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Infrastructure.MessageBrokers;

public static class MessageBrokersCollectionExtensions
{
    private static void AddAzureEventGridSender<T>(this IServiceCollection services, AzureEventGridOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new AzureEventGridSender<T>(
            options.DomainEndpoint,
            options.DomainKey,
            options.Topics[typeof(T).Name]));
    }

    private static void AddAzureEventHubSender<T>(this IServiceCollection services, AzureEventHubOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new AzureEventHubSender<T>(
            options.ConnectionString,
            options.Hubs[typeof(T).Name]));
    }

    private static void AddAzureEventHubReceiver<TConsumer, T>(this IServiceCollection services, AzureEventHubOptions options)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new AzureEventHubReceiver<TConsumer, T>(
            options.ConnectionString,
            options.Hubs[typeof(T).Name],
            options.StorageConnectionString,
            options.StorageContainerNames[typeof(T).Name]));
    }

    private static void AddAzureQueueSender<T>(this IServiceCollection services, AzureQueueOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new AzureQueueSender<T>(
            options.ConnectionString,
            options.QueueNames[typeof(T).Name]));
    }

    private static void AddAzureQueueReceiver<TConsumer, T>(this IServiceCollection services, AzureQueueOptions options)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new AzureQueueReceiver<TConsumer, T>(
            options.ConnectionString,
            options.QueueNames[typeof(T).Name]));
    }

    private static void AddAzureServiceBusSender<T>(this IServiceCollection services, AzureServiceBusOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new AzureServiceBusSender<T>(
            options.ConnectionString,
            options.QueueNames[typeof(T).Name]));
    }

    private static void AddAzureServiceBusReceiver<TConsumer, T>(this IServiceCollection services, AzureServiceBusOptions options)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new AzureServiceBusReceiver<TConsumer, T>(
            options.ConnectionString,
            options.QueueNames[typeof(T).Name]));
    }

    private static void AddFakeSender<T>(this IServiceCollection services)
    {
        services.AddSingleton<IMessageSender<T>>(new FakeSender<T>());
    }

    private static void AddFakeReceiver<TConsumer, T>(this IServiceCollection services)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new FakeReceiver<TConsumer, T>());
    }

    private static void AddKafkaSender<T>(this IServiceCollection services, KafkaOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new KafkaSender<T>(options.BootstrapServers, options.Topics[typeof(T).Name]));
    }

    private static void AddKafkaReceiver<TConsumer, T>(this IServiceCollection services, KafkaOptions options)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new KafkaReceiver<TConsumer, T>(options.BootstrapServers,
            options.Topics[typeof(T).Name],
            options.GroupId));
    }

    private static void AddRabbitMQSender<T>(this IServiceCollection services, RabbitMQOptions options)
    {
        services.AddSingleton<IMessageSender<T>>(new RabbitMQSender<T>(new RabbitMQSenderOptions
        {
            HostName = options.HostName,
            UserName = options.UserName,
            Password = options.Password,
            ExchangeName = options.ExchangeName,
            RoutingKey = options.RoutingKeys[typeof(T).Name],
            MessageEncryptionEnabled = options.MessageEncryptionEnabled,
            MessageEncryptionKey = options.MessageEncryptionKey
        }));
    }

    private static void AddRabbitMQReceiver<TConsumer, T>(this IServiceCollection services, RabbitMQOptions options)
    {
        services.AddTransient<IMessageReceiver<TConsumer, T>>(_ => new RabbitMQReceiver<TConsumer, T>(new RabbitMQReceiverOptions
        {
            HostName = options.HostName,
            UserName = options.UserName,
            Password = options.Password,
            ExchangeName = options.ExchangeName,
            RoutingKey = options.RoutingKeys[typeof(T).Name],
            QueueName = options.Consumers[typeof(TConsumer).Name][typeof(T).Name],
            AutomaticCreateEnabled = true,
            MessageEncryptionEnabled = options.MessageEncryptionEnabled,
            MessageEncryptionKey = options.MessageEncryptionKey
        }));
    }

    public static IServiceCollection AddMessageBusSender<T>(this IServiceCollection services, MessageBrokerOptions options)
    {
        if (options.UsedRabbitMQ())
        {
            services.AddRabbitMQSender<T>(options.RabbitMQ);
        }
        else if (options.UsedKafka())
        {
            services.AddKafkaSender<T>(options.Kafka);
        }
        else if (options.UsedAzureQueue())
        {
            services.AddAzureQueueSender<T>(options.AzureQueue);
        }
        else if (options.UsedAzureServiceBus())
        {
            services.AddAzureServiceBusSender<T>(options.AzureServiceBus);
        }
        else if (options.UsedAzureEventGrid())
        {
            services.AddAzureEventGridSender<T>(options.AzureEventGrid);
        }
        else if (options.UsedAzureEventHub())
        {
            services.AddAzureEventHubSender<T>(options.AzureEventHub);
        }
        else if (options.UsedFake())
        {
            services.AddFakeSender<T>();
        }

        return services;
    }

    public static IServiceCollection AddMessageBusReceiver<TConsumer, T>(this IServiceCollection services, MessageBrokerOptions options)
    {
        if (options.UsedRabbitMQ())
        {
            services.AddRabbitMQReceiver<TConsumer, T>(options.RabbitMQ);
        }
        else if (options.UsedKafka())
        {
            services.AddKafkaReceiver<TConsumer, T>(options.Kafka);
        }
        else if (options.UsedAzureQueue())
        {
            services.AddAzureQueueReceiver<TConsumer, T>(options.AzureQueue);
        }
        else if (options.UsedAzureServiceBus())
        {
            services.AddAzureServiceBusReceiver<TConsumer, T>(options.AzureServiceBus);
        }
        else if (options.UsedAzureEventHub())
        {
            services.AddAzureEventHubReceiver<TConsumer, T>(options.AzureEventHub);
        }
        else if (options.UsedFake())
        {
            services.AddFakeReceiver<TConsumer, T>();
        }

        return services;
    }
}