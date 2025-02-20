﻿using ECommerce.AuditLog.Entities;
using ECommerce.AuditLog.Queries;
using ECommerce.Common.Application.Common;
using ECommerce.Common.Application.Common.Commands;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;


namespace ECommerce.AuditLog.Grpc.Services;

[Authorize]
public class AuditLogService : AuditLog.AuditLogBase
{
    private readonly ILogger<AuditLogService> _logger;
    private readonly Dispatcher _dispatcher;

    public AuditLogService(ILogger<AuditLogService> logger, Dispatcher dispatcher)
    {
        _logger = logger;
        _dispatcher = dispatcher;
    }

    public override async Task<AddAuditLogEntryResponse> AddAuditLogEntry(AddAuditLogEntryRequest request, ServerCallContext context)
    {
        var entry = new AuditLogEntry
        {
            UserId = Guid.Parse(request.Entry.UserId),
            ObjectId = request.Entry.ObjectId,
            Action = request.Entry.Action,
            Log = request.Entry.Log,
            CreatedDateTime = request.Entry.CreatedDateTime.ToDateTimeOffset(),
        };

        await _dispatcher.DispatchAsync(new AddOrUpdateEntityCommand<AuditLogEntry>(entry));

        var response = new AddAuditLogEntryResponse
        {
            Entry = new AuditLogEntryMessage
            {
                Id = entry.Id.ToString(),
                ObjectId = entry.ObjectId,
                UserId = entry.UserId.ToString(),
                Action = entry.Action,
                Log = entry.Log,
                CreatedDateTime = Timestamp.FromDateTimeOffset(entry.CreatedDateTime),
            }
        };

        return response;
    }

    public override async Task<GetAuditLogEntriesResponse> GetAuditLogEntries(GetAuditLogEntriesRequest request, ServerCallContext context)
    {
        var entries = (await _dispatcher.DispatchAsync(new GetAuditEntriesQuery { ObjectId = request.ObjectId }))
            .Select(x => new AuditLogEntryMessage
            {
                Id = x.Id.ToString(),
                ObjectId = x.ObjectId,
                UserId = x.UserId.ToString(),
                Action = x.Action,
                Log = x.Log,
                UserName = x.UserName,
                CreatedDateTime = Timestamp.FromDateTimeOffset(x.CreatedDateTime),
            });

        var rp = new GetAuditLogEntriesResponse();
        rp.Entries.AddRange(entries);
        return rp;
    }
}
