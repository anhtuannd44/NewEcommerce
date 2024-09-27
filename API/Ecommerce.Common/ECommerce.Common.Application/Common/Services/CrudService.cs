using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Common.CrossCuttingConcerns.Exceptions;
using ECommerce.Common.Domain.Events;

namespace ECommerce.Common.Application.Common.Services;

public class CrudService<T> : ICrudService<T>
    where T : BaseEntity<Guid>, IAggregateRoot
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<T, Guid> _repository;
    private readonly Dispatcher _dispatcher;

    public CrudService(IRepository<T, Guid> repository, Dispatcher dispatcher)
    {
        _unitOfWork = repository.UnitOfWork;
        _repository = repository;
        _dispatcher = dispatcher;
    }

    public Task<List<T>> GetAsync(CancellationToken cancellationToken = default)
    {
        return _repository.ToListAsync(_repository.GetQueryableSet());
    }

    public Task<T> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        ValidationException.Requires(id != Guid.Empty, "Invalid Id");
        return _repository.FirstOrDefaultAsync(_repository.GetQueryableSet().Where(x => x.Id == id));
    }

    public async Task AddOrUpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        if (entity.Id.Equals(default))
        {
            await AddAsync(entity, cancellationToken);
            return;
        }
        
        await UpdateAsync(entity, cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _dispatcher.DispatchAsync(new EntityCreatedEvent<T>(entity, DateTime.UtcNow), cancellationToken);
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _dispatcher.DispatchAsync(new EntityUpdatedEvent<T>(entity, DateTime.UtcNow), cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _repository.Delete(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _dispatcher.DispatchAsync(new EntityDeletedEvent<T>(entity, DateTime.UtcNow), cancellationToken);
    }
}