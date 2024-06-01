using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.Blog;

public class BlogFilterParamsDto : BaseDataSourceRequest
{
    public int? Status { get; set; }
    public string SortName { get; set; }
}