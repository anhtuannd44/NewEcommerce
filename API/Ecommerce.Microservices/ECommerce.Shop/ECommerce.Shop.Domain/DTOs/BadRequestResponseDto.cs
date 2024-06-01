namespace ECommerce.Shop.Domain.DTOs;

public class BadRequestResponseDto
{
    public BadRequestResponseDto(string code, string message)
    {
        Code = code;
        Message = message;
    }
    public string Code { get; set; }
    public string Message { get; set; }
}