﻿using ECommerce.Common.Application.Common.Queries;
using ECommerce.Common.Application.Decorators.DatabaseRetry;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Queries;

public class GetRolesQuery : IQuery<List<Role>>
{
    public bool IncludeClaims { get; set; }
    public bool IncludeUserRoles { get; set; }
    public bool AsNoTracking { get; set; }
}

[DatabaseRetry(retryTimes: 2)]
public class GetRolesQueryHandler : IQueryHandler<GetRolesQuery, List<Role>>
{
    private readonly IRoleRepository _roleRepository;

    public GetRolesQueryHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public Task<List<Role>> HandleAsync(GetRolesQuery query, CancellationToken cancellationToken = default)
    {
        var db = _roleRepository.Get(new RoleQueryOptions
        {
            IncludeClaims = query.IncludeClaims,
            IncludeUserRoles = query.IncludeUserRoles,
            AsNoTracking = query.AsNoTracking,
        });

        return _roleRepository.ToListAsync(db);
    }
}
