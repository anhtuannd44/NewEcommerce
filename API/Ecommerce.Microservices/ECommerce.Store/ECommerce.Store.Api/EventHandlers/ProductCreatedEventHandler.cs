using ECommerce.Common.CrossCuttingConcerns.ExtensionMethods;
using ECommerce.Common.Domain.Events;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Store.Api.Commands;
using ECommerce.Store.Api.Constants;
using ECommerce.Store.Api.Entities;
using MediatR;

namespace ECommerce.Store.Api.EventHandlers;

public class ProductCreatedEventHandler(
    IMediator dispatcher,
    ICurrentUser currentUser,
    IRepository<OutboxEvent, Guid> outboxEventRepository)
    : IDomainEventHandler<EntityCreatedEvent<Product>>
{
    public async Task HandleAsync(EntityCreatedEvent<Product> domainEvent, CancellationToken cancellationToken = default)
    {
        await dispatcher.Send(new AddAuditLogEntryCommand
        {
            AuditLogEntry = new AuditLogEntry
            {
                UserId = currentUser.IsAuthenticated ? currentUser.UserId : Guid.Empty,
                CreatedDateTime = domainEvent.EventDateTime,
                Action = "CREATED_PRODUCT",
                ObjectId = domainEvent.Entity.Id.ToString(),
                Log = domainEvent.Entity.AsJsonString(),
            },
        }, cancellationToken);

        await outboxEventRepository.AddOrUpdateAsync(new OutboxEvent
        {
            EventType = EventTypeConstants.ProductCreated,
            TriggeredById = currentUser.UserId,
            CreatedDateTime = domainEvent.EventDateTime,
            ObjectId = domainEvent.Entity.Id.ToString(),
            Message = domainEvent.Entity.AsJsonString(),
            Published = false,
        }, cancellationToken);

        await outboxEventRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}
