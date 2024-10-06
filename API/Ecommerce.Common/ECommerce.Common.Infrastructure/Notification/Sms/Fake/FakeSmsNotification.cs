namespace ECommerce.Common.Infrastructure.Notification.Sms.Fake;

public class FakeSmsNotification : ISmsNotification
{
    public Task SendAsync(ISmsMessage smsMessage, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
