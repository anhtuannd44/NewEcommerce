using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Common.Infrastructure.MessageBrokers.Fake;

public class FakeSender<T> : IMessageSender<T>
{
    public Task SendAsync(T message, MetaData metaData = null, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
