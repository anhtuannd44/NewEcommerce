﻿using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application;

public interface IQueryHandler<TQuery, TResult>
    where TQuery : IQuery<TResult>
{
    Task<TResult> HandleAsync(TQuery query, CancellationToken cancellationToken = default);
}
