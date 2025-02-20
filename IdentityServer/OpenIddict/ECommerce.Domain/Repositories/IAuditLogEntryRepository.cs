﻿using ECommerce.Domain.Entities;
using System;
using System.Linq;

namespace ECommerce.Domain.Repositories;

public class AuditLogEntryQueryOptions
{
    public Guid UserId { get; set; }

    public string ObjectId { get; set; }

    public bool AsNoTracking { get; set; }
}

public interface IAuditLogEntryRepository : IRepository<AuditLogEntry, Guid>
{
    IQueryable<AuditLogEntry> Get(AuditLogEntryQueryOptions queryOptions);
}
