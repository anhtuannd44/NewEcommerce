﻿using ECommerce.Common.CrossCuttingConcerns.ExtensionMethods;
using ECommerce.Common.Domain.Events;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Store.Api.Commands;
using ECommerce.Store.Api.Constants;
using ECommerce.Store.Api.Entities;
using MediatR;

namespace ECommerce.Store.Api.EventHandlers;

public class ProductUpdatedEventHandler : IDomainEventHandler<EntityUpdatedEvent<Product>>
{
    private readonly IMediator _dispatcher;
    private readonly ICurrentUser _currentUser;
    private readonly IRepository<OutboxEvent, Guid> _outboxEventRepository;

    public ProductUpdatedEventHandler(IMediator dispatcher,
        ICurrentUser currentUser,
        IRepository<OutboxEvent, Guid> outboxEventRepository)
    {
        _dispatcher = dispatcher;
        _currentUser = currentUser;
        _outboxEventRepository = outboxEventRepository;
    }

    public async Task HandleAsync(EntityUpdatedEvent<Product> domainEvent, CancellationToken cancellationToken = default)
    {
        await _dispatcher.Send(new AddAuditLogEntryCommand
        {
            AuditLogEntry = new AuditLogEntry
            {
                UserId = _currentUser.UserId,
                CreatedDateTime = domainEvent.EventDateTime,
                Action = "UPDATED_PRODUCT",
                ObjectId = domainEvent.Entity.Id.ToString(),
                Log = domainEvent.Entity.AsJsonString(),
            },
        }, cancellationToken);

        await _outboxEventRepository.AddOrUpdateAsync(new OutboxEvent
        {
            EventType = EventTypeConstants.ProductUpdated,
            TriggeredById = _currentUser.UserId,
            CreatedDateTime = domainEvent.EventDateTime,
            ObjectId = domainEvent.Entity.Id.ToString(),
            Message = domainEvent.Entity.AsJsonString(),
            Published = false,
        }, cancellationToken);

        await _outboxEventRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}
