﻿namespace ECommerce.Storage.Api.DTOs;

public class AuditLogEntryQueryOptions
{
    public Guid UserId { get; set; }

    public string ObjectId { get; set; }

    public bool AsNoTracking { get; set; }
}
