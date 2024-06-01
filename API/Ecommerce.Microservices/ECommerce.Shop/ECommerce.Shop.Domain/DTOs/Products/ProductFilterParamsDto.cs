using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.Products;

public class ProductFilterParamsDto : BaseDataSourceRequest
{
    public string Status { get; set; }
    public string SortName { get; set; }
}