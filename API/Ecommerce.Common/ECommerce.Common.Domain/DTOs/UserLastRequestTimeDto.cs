namespace ECommerce.Common.Domain.DTOs;

public class UserLastRequestTimeDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime? LastRequestTime { get; set; }
}