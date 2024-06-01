using System.Net;
using System.Net.Mail;
using System.Text;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.EmailServices;
using ECommerce.Common.Domain.IService;

namespace ECommerce.Common.Application.Services;

public class EmailSenderServiceBase : IEmailSenderServiceBase
{
    public async Task<bool> SendEmailAsync(SmtpServer smtpServer, EmailInfo emailInfo)
    {
        if (string.IsNullOrEmpty(emailInfo.From)
            || emailInfo.Tos == null || emailInfo.Tos.Count == 0)
        {
            throw new ArgumentException("Missing From/To email.");
        }

        using var mailMsg = new MailMessage();
        mailMsg.From = new MailAddress(emailInfo.From, emailInfo.FromName);

        foreach (var to in emailInfo.Tos)
        {
            if (!string.IsNullOrEmpty(to) && to.IsEmail())
            {
                mailMsg.To.Add(to);
            }
        }

        if (emailInfo.Ccs != null)
        {
            foreach (var cc in emailInfo.Ccs.Where(cc => !string.IsNullOrEmpty(cc) && cc.IsEmail()))
            {
                mailMsg.CC.Add(cc);
            }
        }

        if (emailInfo.Bccs != null)
        {
            foreach (var bcc in emailInfo.Bccs.Where(bcc => !string.IsNullOrEmpty(bcc) && bcc.IsEmail()))
            {
                mailMsg.Bcc.Add(bcc);
            }
        }

        mailMsg.Subject = emailInfo.Subject;

        mailMsg.Body = emailInfo.Body;

        mailMsg.IsBodyHtml = emailInfo.IsHtmlMail;

        mailMsg.BodyEncoding = Encoding.GetEncoding("UTF-8");

        if (emailInfo.AttachmentFilePathList != null)
        {
            this.AttachFiles(mailMsg, emailInfo.AttachmentFilePathList);
        }

        var client = new SmtpClient(smtpServer.Host);

        if (smtpServer.Port.HasValue)
        {
            client.Port = smtpServer.Port.Value;
        }

        if (smtpServer.EnableSsl.HasValue)
        {
            client.EnableSsl = smtpServer.EnableSsl.Value;
        }

        if (!string.IsNullOrWhiteSpace(smtpServer.Username) && !string.IsNullOrWhiteSpace(smtpServer.Password))
        {
            client.Credentials = new NetworkCredential(smtpServer.Username, smtpServer.Password);
        }

        await client.SendMailAsync(mailMsg);

        return true;
    }
    
    private void AttachFiles(MailMessage mailMsg, IDictionary<string, string> attachmentFilePathList)
    {
        if (attachmentFilePathList == null)
        {
            return;
        }

        foreach (var attachmentFilePath in attachmentFilePathList)
        {
            var sendFile = new FileInfo(attachmentFilePath.Key);
            if (!sendFile.Exists)
            {
                continue;
            }

            var stream = sendFile.OpenRead();
            var fileName = sendFile.Name;
            if (!string.IsNullOrEmpty(attachmentFilePath.Value))
            {
                fileName = attachmentFilePath.Value;
            }

            mailMsg.Attachments.Add(new Attachment(stream, fileName));
        }
    }
}