using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Store.Api.Entities;
using MediatR;

namespace ECommerce.Store.Api.Commands;

public class PublishEventsCommand : IRequest
{
    public int SentEventsCount { get; set; }
}

public class PublishEventsCommandHandler : IRequestHandler<PublishEventsCommand>
{
    private readonly ILogger<PublishEventsCommandHandler> _logger;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IRepository<OutboxEvent, Guid> _outboxEventRepository;
    private readonly IMessageBus _messageBus;

    public PublishEventsCommandHandler(ILogger<PublishEventsCommandHandler> logger,
        IDateTimeProvider dateTimeProvider,
        IRepository<OutboxEvent, Guid> outboxEventRepository,
        IMessageBus messageBus)
    {
        _logger = logger;
        _dateTimeProvider = dateTimeProvider;
        _outboxEventRepository = outboxEventRepository;
        _messageBus = messageBus;
    }

    public async Task Handle(PublishEventsCommand command, CancellationToken cancellationToken = default)
    {
        var events = _outboxEventRepository.GetQueryableSet()
            .Where(x => !x.Published)
            .OrderBy(x => x.CreatedDateTime)
            .Take(50)
            .ToList();

        foreach (var eventLog in events)
        {
            var outbox = new PublishingOutBoxEvent
            {
                Id = eventLog.Id.ToString(),
                EventType = eventLog.EventType,
                EventSource = typeof(PublishEventsCommand).Assembly.GetName().Name,
                Payload = eventLog.Message,
            };

            await _messageBus.SendAsync(outbox, cancellationToken);

            eventLog.Published = true;
            eventLog.UpdatedDateTime = _dateTimeProvider.OffsetNow;
            await _outboxEventRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
        }

        command.SentEventsCount = events.Count;
    }
}