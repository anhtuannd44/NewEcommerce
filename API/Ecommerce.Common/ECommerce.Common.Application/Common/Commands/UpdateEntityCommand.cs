using ECommerce.Common.Application.Common.Services;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Application.Common.Commands;

public class UpdateEntityCommand<TEntity> : ICommand
    where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    public UpdateEntityCommand(TEntity entity)
    {
        Entity = entity;
    }

    public TEntity Entity { get; set; }
}

internal class UpdateEntityCommandHandler<TEntity> : ICommandHandler<UpdateEntityCommand<TEntity>>
where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    private readonly ICrudService<TEntity> _crudService;

    public UpdateEntityCommandHandler(ICrudService<TEntity> crudService)
    {
        _crudService = crudService;
    }

    public async Task HandleAsync(UpdateEntityCommand<TEntity> command, CancellationToken cancellationToken = default)
    {
        await _crudService.UpdateAsync(command.Entity);
    }
}
