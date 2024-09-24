using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ECommerce.Notification.Api.Hubs;

[Authorize]
public class NotificationHub : Hub
{
}
