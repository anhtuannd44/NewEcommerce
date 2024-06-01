namespace ECommerce.Common.Domain.DTOs.BaseDto;

public class BaseErrorResponseDto
{
    public BaseErrorResponseDto(string error, List<string> errorList)
    {
        Error = error;
        ErrorList = errorList;
    }

    public string Error { get; set; }
    public List<string> ErrorList { get; set; }
}