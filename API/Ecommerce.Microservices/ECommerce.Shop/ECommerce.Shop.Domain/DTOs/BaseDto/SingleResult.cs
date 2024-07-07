namespace ECommerce.Shop.Domain.DTOs.BaseDto;

public class SingleResult<T> where T : class
{
    public T Data { get; set; }
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
}