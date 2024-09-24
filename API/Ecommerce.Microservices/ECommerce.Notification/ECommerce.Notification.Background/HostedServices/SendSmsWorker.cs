using ECommerce.Common.Application.Common;
using ECommerce.Notification.Commands;

namespace ECommerce.Notification.Background.HostedServices;

public class SendSmsWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<SendSmsWorker> _logger;

    public SendSmsWorker(IServiceProvider services,
        ILogger<SendSmsWorker> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogDebug("SendSmsService is starting.");
        await DoWork(stoppingToken);
    }

    private async Task DoWork(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogDebug($"SendSms task doing background work.");

            var sendSmsesCommand = new SendSmsMessagesCommand();

            using (var scope = _services.CreateScope())
            {
                var dispatcher = scope.ServiceProvider.GetRequiredService<Dispatcher>();

                await dispatcher.DispatchAsync(sendSmsesCommand);
            }

            if (sendSmsesCommand.SentMessagesCount == 0)
            {
                await Task.Delay(10000, stoppingToken);
            }
        }

        _logger.LogDebug($"ResendSms background task is stopping.");
    }
}