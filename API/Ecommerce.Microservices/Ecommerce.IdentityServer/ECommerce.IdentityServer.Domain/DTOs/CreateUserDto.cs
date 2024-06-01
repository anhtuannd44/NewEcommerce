using System.ComponentModel.DataAnnotations;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class CreateUserDto
{
    [Required]
    public string Fullname { get; set; }

    public string Password { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Invalid UserName")]
    public string Email { get; set; }
    public string Status { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
}