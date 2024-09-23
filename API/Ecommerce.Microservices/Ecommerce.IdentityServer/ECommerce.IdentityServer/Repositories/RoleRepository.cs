using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.IdentityServer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.IdentityServer.Repositories;

public class RoleRepository : Repository<Role, Guid>, IRoleRepository
{
    public RoleRepository(IdentityDbContext dbContext, IDateTimeProvider dateTimeProvider)
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
            //query = query.Include(x => x.UserRoles);
        }

        if (queryOptions.IncludeUsers)
        {
            query = query.Include("UserRoles.User");
        }

        if (queryOptions.AsNoTracking)
        {
            query = query = query.AsNoTracking();
        }

        return query;
    }
}
