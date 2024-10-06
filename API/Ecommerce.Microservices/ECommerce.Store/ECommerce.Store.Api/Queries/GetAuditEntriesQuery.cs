using ECommerce.Store.Api.DTOs;
using ECommerce.Store.Api.Entities;
using ECommerce.Store.Api.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Store.Api.Queries;

public class GetAuditEntriesQuery : AuditLogEntryQueryOptions, IRequest<List<AuditLogEntryDTO>>;

public class GetAuditEntriesQueryHandler : IRequestHandler<GetAuditEntriesQuery, List<AuditLogEntryDTO>>
{
    private readonly StoreDbContext _dbContext;
    private readonly IMediator _dispatcher;

    public GetAuditEntriesQueryHandler(StoreDbContext dbContext, IMediator dispatcher)
    {
        _dbContext = dbContext;
        _dispatcher = dispatcher;
    }

    public async Task<List<AuditLogEntryDTO>> Handle(GetAuditEntriesQuery queryOptions, CancellationToken cancellationToken = default)
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
        var users = await _dispatcher.Send(new GetUsersQuery(), cancellationToken);

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
