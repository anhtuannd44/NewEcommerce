using ECommerce.AuditLog.DTOs;
using ECommerce.AuditLog.Entities;
using ECommerce.Common.Application.Common;
using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Common.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ECommerce.AuditLog.MessageBusConsumers;

public sealed class AuditLogAggregationConsumer : IMessageBusConsumer<AuditLogAggregationConsumer, AuditLogCreatedEvent>
{
    private readonly ILogger<AuditLogAggregationConsumer> _logger;
    private readonly IServiceProvider _serviceProvider;

    public AuditLogAggregationConsumer(ILogger<AuditLogAggregationConsumer> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task HandleAsync(AuditLogCreatedEvent data, MetaData metaData, CancellationToken cancellationToken = default)
    {
        var dispatcher = _serviceProvider.GetRequiredService<Dispatcher>();
        var idempotentRequestRepository = _serviceProvider.GetRequiredService<IRepository<IdempotentRequest, Guid>>();

        const string requestType = "ADD_AUDIT_LOG_ENTRY";
        
        if (idempotentRequestRepository == null)
        {
            return;
        }
        
        var requestProcessed = await idempotentRequestRepository.GetQueryableSet()
            .AnyAsync(x => x.RequestType == requestType && x.RequestId == metaData.MessageId, cancellationToken: cancellationToken);

        if (requestProcessed)
        {
            return;
        }
        
        var uow = idempotentRequestRepository.UnitOfWork;

        await uow.BeginTransactionAsync(cancellationToken: cancellationToken);

        data.AuditLog.Id = Guid.Empty;
        if (dispatcher != null)
            await dispatcher.DispatchAsync(new AddOrUpdateEntityCommand<AuditLogEntry>(data.AuditLog), cancellationToken);

        _logger.LogInformation(data.AuditLog.Action);

        await idempotentRequestRepository.AddAsync(new IdempotentRequest
        {
            RequestType = requestType,
            RequestId = metaData.MessageId,
        }, cancellationToken);

        await uow.SaveChangesAsync(cancellationToken);

        await uow.CommitTransactionAsync(cancellationToken);
    }
}
