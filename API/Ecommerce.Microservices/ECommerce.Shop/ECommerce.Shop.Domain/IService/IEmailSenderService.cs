using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.IService;

public interface IEmailSenderService
{
    Task<bool> SendEmailAsync(EmailDto emailInfo);
}