namespace ECommerce.Common.Domain.Infrastructure.MessageBrokers;

// ReSharper disable UnusedTypeParameter TypeParameterCanBeVariant
public interface IMessageBusConsumer<TConsumer, T>
{
    Task HandleAsync(T data, MetaData metaData, CancellationToken cancellationToken = default);
}
