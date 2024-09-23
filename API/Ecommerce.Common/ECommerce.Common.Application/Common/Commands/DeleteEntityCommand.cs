using ECommerce.Common.Application.Common.Services;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Application.Common.Commands;

public class DeleteEntityCommand<TEntity> : ICommand
     where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    public TEntity Entity { get; set; }
}

internal class DeleteEntityCommandHandler<TEntity> : ICommandHandler<DeleteEntityCommand<TEntity>>
where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    private readonly ICrudService<TEntity> _crudService;

    public DeleteEntityCommandHandler(ICrudService<TEntity> crudService)
    {
        _crudService = crudService;
    }

    public async Task HandleAsync(DeleteEntityCommand<TEntity> command, CancellationToken cancellationToken = default)
    {
        await _crudService.DeleteAsync(command.Entity);
    }
}
