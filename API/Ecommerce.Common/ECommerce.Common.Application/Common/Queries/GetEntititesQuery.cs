using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.IRepositories;

namespace ECommerce.Common.Application.Common.Queries;

public class GetEntitiesQuery<TEntity> : IQuery<List<TEntity>>
     where TEntity : BaseEntity<Guid>, IAggregateRoot
{
}

internal class GetEntitiesQueryHandler<TEntity> : IQueryHandler<GetEntitiesQuery<TEntity>, List<TEntity>>
where TEntity : BaseEntity<Guid>, IAggregateRoot
{
    private readonly IRepository<TEntity, Guid> _repository;

    public GetEntitiesQueryHandler(IRepository<TEntity, Guid> repository)
    {
        _repository = repository;
    }

    public Task<List<TEntity>> HandleAsync(GetEntitiesQuery<TEntity> query, CancellationToken cancellationToken = default)
    {
        return _repository.ToListAsync(_repository.GetQueryableSet());
    }
}
