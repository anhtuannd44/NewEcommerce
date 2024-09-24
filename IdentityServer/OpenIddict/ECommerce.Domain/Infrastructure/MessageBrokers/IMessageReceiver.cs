using System;

namespace ECommerce.Domain.Infrastructure.MessageBrokers;

public interface IMessageReceiver<T>
{
    void Receive(Action<T, MetaData> action);
}
