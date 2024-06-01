namespace ECommerce.Common.Domain.DTOs.BaseDto;

public class BaseDataSourceRequest
{
    public string Keyword { get; set; }
    public bool? IsAscending { get; set; } = true;
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }
}