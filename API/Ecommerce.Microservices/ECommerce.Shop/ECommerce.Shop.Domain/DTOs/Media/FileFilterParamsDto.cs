using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.Media
{
    public class FileFilterParamsDto : BaseDataSourceRequest
    {
        public int? Status { get; set; }
        public string SortName { get; set; }
    }
}