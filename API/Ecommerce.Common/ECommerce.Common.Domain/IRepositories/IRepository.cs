﻿using System.Linq.Expressions;
using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.IRepositories;

public interface IRepository<TEntity, TKey> : IConcurrencyHandler<TEntity>
    where TEntity : BaseEntity<TKey>, IAggregateRoot
{
    IUnitOfWork UnitOfWork { get; }

    IQueryable<TEntity> GetQueryableSet();

    Task AddOrUpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

    void Delete(TEntity entity);

    Task<T> FirstOrDefaultAsync<T>(IQueryable<T> query);

    Task<T> SingleOrDefaultAsync<T>(IQueryable<T> query);

    Task<List<T>> ToListAsync<T>(IQueryable<T> query);

    void BulkInsert(IEnumerable<TEntity> entities);

    void BulkInsert(IEnumerable<TEntity> entities, Expression<Func<TEntity, object>> columnNamesSelector);

    void BulkUpdate(IEnumerable<TEntity> entities, Expression<Func<TEntity, object>> columnNamesSelector);

    void BulkMerge(IEnumerable<TEntity> entities, Expression<Func<TEntity, object>> idSelector, Expression<Func<TEntity, object>> updateColumnNamesSelector,
        Expression<Func<TEntity, object>> insertColumnNamesSelector);

    void BulkDelete(IEnumerable<TEntity> entities);
}