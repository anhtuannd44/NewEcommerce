namespace ECommerce.Common.Infrastructure.ConfigurationOptions;

public class AuthOptions
{
    public string AllowedUserType { get; set; }
    public int AccountLockoutTimeSpan { get; set; }
    public int MaxFailedAccessAttemptsBeforeLockout { get; set; }
    public int MinimumPasswordAge { get; set; }
    public int PasswordHistoryLimit { get; set; }
    public int PasswordChangeDuration { get; set; }
    public int PasswordResetTokenLifeSpan { get; set; }
    public int FirstPasswordExpiredDuration { get; set; }
    public TokenExpireOptions TokenExpire { get; set; }
    public JwtOptions Jwt { get; set; }
}

public class TokenExpireOptions
{
    public int ResourceOwnerCredentials { get; set; }
    public int ClientCredentials { get; set; }
}

public class JwtOptions
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string SymmetricKey { get; set; }
}