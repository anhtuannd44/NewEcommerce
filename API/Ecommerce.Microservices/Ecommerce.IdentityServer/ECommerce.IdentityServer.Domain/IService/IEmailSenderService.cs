using ECommerce.Common.Domain.DTOs;

namespace ECommerce.IdentityServer.Domain.IService;

public interface IEmailSenderService
{
    Task<bool> SendEmailAsync(EmailDto emailInfo);
}