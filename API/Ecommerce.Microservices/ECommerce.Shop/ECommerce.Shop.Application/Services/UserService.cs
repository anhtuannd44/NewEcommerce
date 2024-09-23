using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain.DTOs.User;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class UserService : BaseService<UserService>, IUserService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public UserService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<UserService> logger) : base(configuration, unitOfWork, logger)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<UserListResponseDto> GetUserListAsync(UserFilterParamsDto searchDto)
    {
        var query = _unitOfWork.Repository<User>().AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.Keyword))
        {
            var keyword = searchDto.Keyword.Trim();
            query = query.Where(x => x.FullName.Contains(keyword));
        }

        if (searchDto.DateFrom.HasValue)
            query = query.Where(x => searchDto.DateFrom.Value <= x.CreatedDate);

        if (searchDto.DateTo.HasValue)
            query = query.Where(x => searchDto.DateTo.Value >= x.CreatedDate);
        if (!string.IsNullOrEmpty(searchDto.Status))
        {
            query = query.Where(x => x.Status.GetDescription() == searchDto.Status.ToLower());
        }

        query = searchDto.SortName switch
        {
            "fullname" => query.OrderByIf(x => x.FullName, searchDto.IsAscending ?? true),
            "phonenumber" => query.OrderByIf(x => x.PhoneNumber, searchDto.IsAscending ?? true),
            "email" => query.OrderByIf(x => x.Email, searchDto.IsAscending ?? true),
            _ => query.OrderByDescending(x => x.CreatedDate)
        };

        var productListFromDb = await query.ToListAsync();

        if (searchDto.PageNumber != null && searchDto.PageSize != null)
        {
            productListFromDb = productListFromDb.Skip((searchDto.PageNumber.Value - 1) * searchDto.PageSize.Value).Take(searchDto.PageSize.Value).ToList();
        }

        var total = await query.CountAsync();
        var productListResponse = productListFromDb.Select(x => new UserInListResponseDto()
        {
            Id = x.Id,
            FullName = x.FullName,
            Address = x.Address,
            Email = x.Email,
            PhoneNumber = x.PhoneNumber
        }).ToList();

        var result = new UserListResponseDto
        {
            Data = productListResponse,
            Total = total
        };
        return result;
    }
}