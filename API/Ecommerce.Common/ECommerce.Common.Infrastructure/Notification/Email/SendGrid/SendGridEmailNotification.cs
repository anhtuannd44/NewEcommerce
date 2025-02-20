﻿using SendGrid;
using SendGrid.Helpers.Mail;

namespace ECommerce.Common.Infrastructure.Notification.Email.SendGrid;

public class SendGridEmailNotification : IEmailNotification
{
    private readonly SendGridOptions _options;

    public SendGridEmailNotification(SendGridOptions options)
    {
        _options = options;
    }

    public async Task SendAsync(IEmailMessage emailMessage, CancellationToken cancellationToken = default)
    {
        var client = new SendGridClient(_options.ApiKey);
        var from = new EmailAddress(!string.IsNullOrWhiteSpace(_options.OverrideFrom) ? _options.OverrideFrom : emailMessage.From);

        var tos = (!string.IsNullOrWhiteSpace(_options.OverrideTos) ? _options.OverrideTos : emailMessage.Tos)?.Split(';')
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => new EmailAddress(x))
            .ToList();

        var msg = MailHelper.CreateSingleEmailToMultipleRecipients(from, tos, emailMessage.Subject, string.Empty, emailMessage.Body, showAllRecipients: true);
        await client.SendEmailAsync(msg, cancellationToken);
    }
}
