namespace ECommerce.Shop.Domain.DTOs.User;

public class UserListForCreateOrderResponseDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string Email { get; set; }
}