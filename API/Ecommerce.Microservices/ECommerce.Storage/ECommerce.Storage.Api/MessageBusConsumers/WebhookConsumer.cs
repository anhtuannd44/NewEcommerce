using ECommerce.Storage.Api.DTOs;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;

namespace ECommerce.Storage.Api.MessageBusConsumers;

public sealed class WebhookConsumer :
    IMessageBusConsumer<WebhookConsumer, FileUploadedEvent>,
    IMessageBusConsumer<WebhookConsumer, FileDeletedEvent>
{
    private static readonly HttpClient _httpClient = new();

    private readonly ILogger<WebhookConsumer> _logger;
    private readonly IConfiguration _configuration;

    public WebhookConsumer(ILogger<WebhookConsumer> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task HandleAsync(FileUploadedEvent data, MetaData metaData, CancellationToken cancellationToken = default)
    {
        var url = _configuration["Webhooks:FileUploadedEvent:PayloadUrl"];
        await _httpClient.PostAsJsonAsync(url, data.FileEntry, cancellationToken: cancellationToken);
    }

    public async Task HandleAsync(FileDeletedEvent data, MetaData metaData, CancellationToken cancellationToken = default)
    {
        var url = _configuration["Webhooks:FileDeletedEvent:PayloadUrl"];
        await _httpClient.PostAsJsonAsync(url, data.FileEntry, cancellationToken: cancellationToken);
    }
}
