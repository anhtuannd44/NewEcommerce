namespace ECommerce.Common.Domain.EmailServices;

public class EmailInfo
{
    public string From { get; set; }
    public string FromName { get; set; }
    public IList<string> Tos { get; set; }
    public IList<string> Ccs { get; set; }
    public IList<string> Bccs { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public bool IsHtmlMail { get; set; }

    public IDictionary<string, string> AttachmentFilePathList { get; set; }
}