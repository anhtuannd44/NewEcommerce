using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.User;

public class UserFilterParamsDto : BaseDataSourceRequest
{
    public string Status { get; set; }
    public string SortName { get; set; }
}