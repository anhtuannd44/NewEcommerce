using ECommerce.Common.Application.Common.Services;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Application.Common.Commands;

public class AddEntityCommand<TEntity> : ICommand
    where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    public AddEntityCommand(TEntity entity)
    {
        Entity = entity;
    }

    public TEntity Entity { get; set; }
}

internal class AddEntityCommandHandler<TEntity> : ICommandHandler<AddEntityCommand<TEntity>>
    where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    private readonly ICrudService<TEntity> _crudService;

    public AddEntityCommandHandler(ICrudService<TEntity> crudService)
    {
        _crudService = crudService;
    }

    public async Task HandleAsync(AddEntityCommand<TEntity> command, CancellationToken cancellationToken = default)
    {
        await _crudService.AddAsync(command.Entity, cancellationToken);
    }
}