using ECommerce.Common.Infrastructure.Notification.Sms;

namespace ECommerce.Notification.DTOs;

public class SmsMessageDTO : ISmsMessage
{
    public string Message { get; set; }

    public string PhoneNumber { get; set; }
}
