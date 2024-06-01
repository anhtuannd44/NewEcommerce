using ECommerce.Common.Domain.EmailServices;

namespace ECommerce.Common.Domain.IService;

public interface IEmailSenderServiceBase
{
    Task<bool> SendEmailAsync(SmtpServer smtpServer, EmailInfo emailInfo);
}