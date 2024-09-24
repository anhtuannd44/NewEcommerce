using ECommerce.Infrastructure.Notification.Email;
using ECommerce.Infrastructure.Notification.Sms;
using ECommerce.Infrastructure.Notification.Web;

namespace ECommerce.Infrastructure.Notification;

public class NotificationOptions
{
    public EmailOptions Email { get; set; }

    public SmsOptions Sms { get; set; }

    public WebOptions Web { get; set; }
}
