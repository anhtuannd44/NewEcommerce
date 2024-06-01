using System.ComponentModel.DataAnnotations;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class UpdateUserDto
{
    public Guid Id { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Invalid UserName")]
    public string UserName { get; set; }

    [Required] public string FullName { get; set; }
}