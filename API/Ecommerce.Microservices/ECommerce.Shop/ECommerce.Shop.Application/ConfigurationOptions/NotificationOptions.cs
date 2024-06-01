namespace ECommerce.Shop.Application.ConfigurationOptions;

public class NotificationOptions
{
    public EmailOptions Email { get; set; } // Nested options for Email omitted for brevity
}

public class EmailOptions
{
    public string SmtpServerHost { get; set; }
    public bool SmtpServerEnableSsl { get; set; }
    public int? SmtpServerPort { get; set; }
    public string SmtpServerUserName { get; set; }
    public string SmtpServerPassword { get; set; }
}

public class SupportOptions
{
    public string From { get; set; }
    public List<string> Tos { get; set; } // Consider using a list for multiple email addresses
}

public class AskAQuestionOptions
{
    public List<string> Tos { get; set; } // Consider using a list for multiple email addresses
}