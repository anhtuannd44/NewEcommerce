using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Common.Infrastructure.MessageBrokers.Fake;

public class FakeReceiver<TConsumer, T> : IMessageReceiver<TConsumer, T>
{
    public Task ReceiveAsync(Func<T, MetaData, Task> action, CancellationToken cancellationToken)
    {
        // do nothing
        return Task.CompletedTask;
    }
}
