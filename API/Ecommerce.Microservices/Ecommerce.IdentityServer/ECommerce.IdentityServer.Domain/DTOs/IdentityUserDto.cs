using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class IdentityUserDto : BaseDto<Guid>
{
    public new Guid Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool Status { get; set; }
    
    
    public bool RequirePasswordChanged { get; set; }
    
    public DateTime? PasswordExpiryDate { get; set; }

    public int AccessFailedCount { get; set; }
    public DateTime? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public string SecurityStamp { get; set; }

    public bool IsElectronicSignatureActive { get; set; }
    public string ElectronicSignature { get; set; }
    public string ElectronicSignatureFileName { get; set; }
}