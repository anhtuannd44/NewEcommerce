using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities;

public class Email : BaseEntity<Guid>
{
    public string Subject { get; set; }
    public EmailType MailType { get; set; }
    public string MailFrom { get; set; }
    public string MailTo { get; set; }
    public string MailCc { get; set; }
    public string MailBcc { get; set; }
    public string Body { get; set; }
    public bool Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid? TemplateId { get; set; }
    public string Note { get; set; }
    public int RetryCount { get; set; }
}