using ECommerce.Notification.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ECommerce.Notification.Api.HostedServices;

public class PushNotificationHostedService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<PushNotificationHostedService> _logger;

    public PushNotificationHostedService(IServiceProvider services,
        ILogger<PushNotificationHostedService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await DoWork(stoppingToken);
    }

    private async Task DoWork(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _services.CreateScope())
            {
                var notificationHubContext = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();

                await notificationHubContext.Clients.All.SendAsync("ReceiveMessage", $"Test message from NotificationHub ...", cancellationToken: stoppingToken);
            }

            await Task.Delay(30000, stoppingToken);
        }
    }
}