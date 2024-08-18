using System.Text.Json.Serialization;

namespace ECommerce.Common.Domain.DTOs;

public class ActionEntityStatusDto
{
    public bool IsSuccess { get; set; } = false;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Message { get; set; } = string.Empty;
}