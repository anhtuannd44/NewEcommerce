using ECommerce.Common.Application.Common;
using ECommerce.Common.Application.Common.Queries;
using ECommerce.Storage.Api.DTOs;
using ECommerce.Storage.Api.Entities;
using ECommerce.Storage.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Storage.Api.Queries;

public class GetAuditEntriesQuery : AuditLogEntryQueryOptions, IQuery<List<AuditLogEntryDTO>>;

public class GetAuditEntriesQueryHandler : IQueryHandler<GetAuditEntriesQuery, List<AuditLogEntryDTO>>
{
    private readonly StorageDbContext _dbContext;
    private readonly Dispatcher _dispatcher;

    public GetAuditEntriesQueryHandler(StorageDbContext dbContext, Dispatcher dispatcher)
    {
        _dbContext = dbContext;
        _dispatcher = dispatcher;
    }

    public async Task<List<AuditLogEntryDTO>> HandleAsync(GetAuditEntriesQuery queryOptions, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Set<AuditLogEntry>() as IQueryable<AuditLogEntry>;

        if (queryOptions.UserId != Guid.Empty)
        {
            query = query.Where(x => x.UserId == queryOptions.UserId);
        }

        if (!string.IsNullOrEmpty(queryOptions.ObjectId))
        {
            query = query.Where(x => x.ObjectId == queryOptions.ObjectId);
        }

        if (queryOptions.AsNoTracking)
        {
            query = query.AsNoTracking();
        }

        var auditLogs = await query.ToListAsync(cancellationToken: cancellationToken);
        var users = await _dispatcher.DispatchAsync(new GetUsersQuery(), cancellationToken);

        var rs = auditLogs.Join(users, x => x.UserId, y => y.Id,
            (x, y) => new AuditLogEntryDTO
            {
                Id = x.Id,
                UserId = x.UserId,
                Action = x.Action,
                ObjectId = x.ObjectId,
                Log = x.Log,
                CreatedDateTime = x.CreatedDateTime,
                UserName = y.UserName,
            });

        return rs.OrderByDescending(x => x.CreatedDateTime).ToList();
    }
}
