using System.Text;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Common.Infrastructure.MessageBrokers.AzureServiceBus;

public class AzureServiceBusReceiver<TConsumer, T> : IMessageReceiver<TConsumer, T>
{
    private readonly string _connectionString;
    private readonly string _queueName;

    public AzureServiceBusReceiver(string connectionString, string queueName)
    {
        _connectionString = connectionString;
        _queueName = queueName;
    }

    public async Task ReceiveAsync(Func<T, MetaData, Task> action, CancellationToken cancellationToken)
    {
        await ReceiveStringAsync(async retrievedMessage =>
        {
            var message = JsonSerializer.Deserialize<Message<T>>(retrievedMessage);
            await action(message.Data, message.MetaData);
        }, cancellationToken);
    }

    private async Task ReceiveStringAsync(Func<string, Task> action, CancellationToken cancellationToken)
    {
        await using var client = new ServiceBusClient(_connectionString);
        var receiver = client.CreateReceiver(_queueName);

        while (!cancellationToken.IsCancellationRequested)
        {
            var retrievedMessage = await receiver.ReceiveMessageAsync(cancellationToken: cancellationToken);

            if (retrievedMessage != null)
            {
                await action(Encoding.UTF8.GetString(retrievedMessage.Body));
                await receiver.CompleteMessageAsync(retrievedMessage, cancellationToken);
            }
            else
            {
                await Task.Delay(1000, cancellationToken);
            }
        }
    }
}
