﻿using ECommerce.Domain.Notification;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Notification.Sms.Fake;

public class FakeSmsNotification : ISmsNotification
{
    public Task SendAsync(ISmsMessage smsMessage, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
