﻿using ECommerce.CrossCuttingConcerns.DateTimes;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ECommerce.Persistence.Repositories;

public class RoleRepository : Repository<Role, Guid>, IRoleRepository
{
    public RoleRepository(ECommerceDbContext dbContext, IDateTimeProvider dateTimeProvider)
        : base(dbContext, dateTimeProvider)
    {
    }

    public IQueryable<Role> Get(RoleQueryOptions queryOptions)
    {
        var query = GetQueryableSet();

        if (queryOptions.IncludeClaims)
        {
            query = query.Include(x => x.Claims);
        }

        if (queryOptions.IncludeUserRoles)
        {
            query = query.Include(x => x.UserRoles);
        }

        if (queryOptions.IncludeUsers)
        {
            query = query.Include("UserRoles.User");
        }

        if (queryOptions.AsNoTracking)
        {
            query = query.AsNoTracking();
        }

        return query;
    }
}
