using ECommerce.AuditLog.DTOs;
using ECommerce.AuditLog.Entities;
using ECommerce.AuditLog.Repositories;
using ECommerce.Common.Application.Common;
using ECommerce.Common.Application.Common.DTOs;
using ECommerce.Common.Application.Common.Queries;
using ECommerce.Common.CrossCuttingConcerns.ExtensionMethods;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.AuditLog.Queries;

public class GetPagedAuditEntriesQuery : AuditLogEntryQueryOptions, IQuery<Paged<AuditLogEntryDTO>>
{
    public int Page { get; set; }

    public int PageSize { get; set; }
}

public class GetPagedAuditEntriesQueryHandler : IQueryHandler<GetPagedAuditEntriesQuery, Paged<AuditLogEntryDTO>>
{
    private readonly AuditLogDbContext _dbContext;
    private readonly Dispatcher _dispatcher;

    public GetPagedAuditEntriesQueryHandler(AuditLogDbContext dbContext, Dispatcher dispatcher)
    {
        _dbContext = dbContext;
        _dispatcher = dispatcher;
    }

    public async Task<Paged<AuditLogEntryDTO>> HandleAsync(GetPagedAuditEntriesQuery queryOptions, CancellationToken cancellationToken = default)
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

        var result = new Paged<AuditLogEntryDTO>
        {
            TotalItems = await query.CountAsync(cancellationToken: cancellationToken),
        };

        var auditLogs = await query.OrderByDescending(x => x.CreatedDateTime)
            .Paged(queryOptions.Page, queryOptions.PageSize)
            .ToListAsync(cancellationToken: cancellationToken);

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

        result.Items = rs.ToList();

        return result;
    }
}
