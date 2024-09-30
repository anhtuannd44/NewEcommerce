using ECommerce.Store.Api.Commands;
using MediatR;

namespace ECommerce.Store.Api.HostedServices;

public class PublishEventWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<PublishEventWorker> _logger;

    public PublishEventWorker(IServiceProvider services,
        ILogger<PublishEventWorker> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogDebug("PushlishEventWorker is starting.");
        await DoWork(stoppingToken);
    }

    private async Task DoWork(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogDebug($"PushlishEvent task doing background work.");

            try
            {
                var publishEventsCommand = new PublishEventsCommand();

                using (var scope = _services.CreateScope())
                {
                    var dispatcher = scope.ServiceProvider.GetRequiredService<IMediator>();

                    await dispatcher.Send(publishEventsCommand, stoppingToken);
                }

                if (publishEventsCommand.SentEventsCount == 0)
                {
                    await Task.Delay(10000, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"");
                await Task.Delay(10000, stoppingToken);
            }
        }

        _logger.LogDebug($"PushlishEventWorker background task is stopping.");
    }
}
