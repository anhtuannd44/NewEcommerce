using System.ComponentModel.DataAnnotations;

namespace ECommerce.IdentityServer.Models;

public class ForgotPasswordModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}