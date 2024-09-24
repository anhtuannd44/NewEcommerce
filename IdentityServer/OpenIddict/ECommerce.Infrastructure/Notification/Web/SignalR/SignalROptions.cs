using System.Collections.Generic;

namespace ECommerce.Infrastructure.Notification.Web.SignalR;

public class SignalROptions
{
    public string Endpoint { get; set; }

    public Dictionary<string, string> Hubs { get; set; }

    public Dictionary<string, string> MethodNames { get; set; }
}
