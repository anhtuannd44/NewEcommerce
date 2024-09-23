using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Common.Infrastructure.Notification.Email.SmtpClient;

public class FakeEmailNotification : IEmailNotification
{
    public Task SendAsync(IEmailMessage emailMessage, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
