namespace ECommerce.IdentityServer.Web.DTOs;

public class SetPasswordDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string ConfirmPassword { get; set; }
}