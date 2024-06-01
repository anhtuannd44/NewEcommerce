using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.OS;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.EmailServices;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Domain.IService;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain.IService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Shop.Application.Services;

public class EmailSenderService : BaseService, IEmailSenderService
{
    private readonly IEmailSenderServiceBase _sender;
    private readonly IDateTimeServiceProvider _dateTimeServiceProvider;
    private readonly SmtpServer _smtpServer;
    private readonly AppSettingConfiguration _appSettings = new();

    public EmailSenderService(IConfiguration configuration,
        IEmailSenderServiceBase sender,
        IDateTimeServiceProvider dateTimeServiceProvider,
        ILogger<EmailSenderService> logger,
        IUnitOfWork unitOfWork) : base(configuration, logger, unitOfWork)
    {
        _sender = sender;
        _dateTimeServiceProvider = dateTimeServiceProvider;
        _configuration.Bind(_appSettings);
        _smtpServer = new SmtpServer
        {
            Host = _appSettings.Notification.Email.SmtpServerHost,
            Port = _appSettings.Notification.Email.SmtpServerPort,
            EnableSsl = _appSettings.Notification.Email.SmtpServerEnableSsl,
            Username = _appSettings.Notification.Email.SmtpServerUserName,
            Password = _appSettings.Notification.Email.SmtpServerPassword,
        };
    }

    public async Task<bool> SendEmailAsync(EmailDto email)
    {
        var mail = new Email
        {
            MailFrom = email.MailFrom,
            MailTo = email.MailTo,
            MailType = email.MailType,
            MailBcc = email.MailBcc,
            MailCc = email.MailCc,
            Body = email.Body,
            Note = email.Note,
            RetryCount = email.RetryCount,
            Status = email.Status,
            Subject = email.Subject,
            TemplateId = email.TemplateId,
            CreatedDate = _dateTimeServiceProvider.Now,
        };

        await _unitOfWork.Repository<Email>().AddAsync(mail);
        await _unitOfWork.SaveChangesAsync();

        return await SendEmailByEmailSender(mail);
    }

    private async Task<bool> SendEmailByEmailSender(Email email)
    {
        try
        {
            var emailInfoForSending = new EmailInfo
            {
                From = email.MailFrom,
                Tos = email.MailTo.Split(',').ToList(),
                Subject = email.Subject,
                Body = email.Body,
                IsHtmlMail = true
            };

            if (!string.IsNullOrEmpty(email.MailCc))
            {
                emailInfoForSending.Ccs = email.MailCc.Split(',').ToList();
            }

            if (!string.IsNullOrEmpty(email.MailBcc))
            {
                emailInfoForSending.Bccs = email.MailBcc.Split(',').ToList();
            }

            await _sender.SendEmailAsync(_smtpServer, emailInfoForSending);
            
            _logger.LogInformation($"Send email successfully - From {email.MailFrom} to {emailInfoForSending.Tos}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Send Email Error: ");
            return false;
        }
    }
}