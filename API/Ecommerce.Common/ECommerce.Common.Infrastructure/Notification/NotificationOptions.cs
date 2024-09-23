using ECommerce.Common.Infrastructure.Notification.Email;
using ECommerce.Common.Infrastructure.Notification.Sms;
using ECommerce.Common.Infrastructure.Notification.Web;

namespace ECommerce.Common.Infrastructure.Notification;

public class NotificationOptions
{
    public EmailOptions Email { get; set; }

    public SmsOptions Sms { get; set; }

    public WebOptions Web { get; set; }
}