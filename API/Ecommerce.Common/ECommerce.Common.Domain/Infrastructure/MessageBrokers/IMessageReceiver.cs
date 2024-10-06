namespace ECommerce.Common.Domain.Infrastructure.MessageBrokers;

// ReSharper disable TypeParameterCanBeVariant UnusedTypeParameter
public interface IMessageReceiver<TConsumer, T>
{
    Task ReceiveAsync(Func<T, MetaData, Task> action, CancellationToken cancellationToken);
}
