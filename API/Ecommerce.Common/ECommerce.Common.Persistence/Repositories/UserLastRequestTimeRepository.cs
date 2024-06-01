using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.IRepositories;

namespace ECommerce.Common.Persistence.Repositories;

public class UserLastRequestTimeRepository : IUserLastRequestTimeRepository
{
    private readonly ECommerceDbContext _dbContext;
    public UserLastRequestTimeRepository(ECommerceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task UpdateUserLastRequestTimeAsync(Guid userId)
    {
        await _dbContext.Database.GetDbConnection().ExecuteAsync("[dbo].[sp_UpdateUserLastRequestTimeByUserId]", new { UserId = userId }, commandType: CommandType.StoredProcedure);
    }

    public async Task<UserLastRequestTimeDto> FindUserLastRequestTimeByUserIdAsync(Guid userId)
    {
        var queryResult = await _dbContext.Database.GetDbConnection().QueryAsync<UserLastRequestTimeDto>("[dbo].[sp_GetUserLastRequestTimeByUserId]", new { UserId = userId }, commandType: CommandType.StoredProcedure);
        return queryResult.FirstOrDefault();
    }
}