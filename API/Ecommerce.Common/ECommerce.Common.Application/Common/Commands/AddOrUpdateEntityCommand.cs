using ECommerce.Common.Application.Common.Services;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Application.Common.Commands;

public class AddOrUpdateEntityCommand<TEntity> : ICommand
    where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    public AddOrUpdateEntityCommand(TEntity entity)
    {
        Entity = entity;
    }

    public TEntity Entity { get; set; }
}

internal class AddOrUpdateEntityCommandHandler<TEntity> : ICommandHandler<AddOrUpdateEntityCommand<TEntity>>
where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    private readonly ICrudService<TEntity> _crudService;

    public AddOrUpdateEntityCommandHandler(ICrudService<TEntity> crudService)
    {
        _crudService = crudService;
    }

    public async Task HandleAsync(AddOrUpdateEntityCommand<TEntity> command, CancellationToken cancellationToken = default)
    {
        await _crudService.AddOrUpdateAsync(command.Entity);
    }
}
