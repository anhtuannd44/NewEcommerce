using ECommerce.CrossCuttingConcerns.DateTimes;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ECommerce.Persistence.Repositories;

public class AuditLogEntryRepository : Repository<AuditLogEntry, Guid>, IAuditLogEntryRepository
{
    public AuditLogEntryRepository(ECommerceDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }

    public IQueryable<AuditLogEntry> Get(AuditLogEntryQueryOptions queryOptions)
    {
        var query = GetQueryableSet();

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

        return query;
    }
}
