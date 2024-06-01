using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class ProductFilterParamsDto : BaseDataSourceRequest
{
    public bool? IsActive { get; set; }
    public string SortName { get; set; }
}