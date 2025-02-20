﻿namespace ECommerce.Common.Infrastructure.Notification.Web;

public interface IWebNotification<T>
{
    Task SendAsync(T message, CancellationToken cancellationToken = default);
}
