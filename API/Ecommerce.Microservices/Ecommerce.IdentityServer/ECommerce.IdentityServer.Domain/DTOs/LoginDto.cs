using System.Text.Json.Serialization;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class LoginDto
{
    [JsonPropertyName("grand_type")] public string GrantType { get; set; }
    [JsonPropertyName("email")] public string Email { get; set; }
    [JsonPropertyName("password")] public string Password { get; set; }
    [JsonPropertyName("refresh_token")] public string RefreshToken { get; set; }
}

public class RefreshTokenDto
{
    public string ClientId { get; set; }
    public string UserName { get; set; }
    public string TokenHash { get; set; }
    public DateTime Expiration { get; set; }
    public DateTime? ConsumedTime { get; set; }
    public string Scope { get; set; }
}

public class LoginErrorResponse
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    [JsonPropertyName("error")]
    public string Error { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    [JsonPropertyName("error_description")]
    public string ErrorDescription { get; set; }
}

public class LoginResponse
{
    [JsonPropertyName("userInfo")] public UserInfo UserInfo { get; set; }

    [JsonPropertyName("tokenInfo")] public TokenInfo TokenInfo { get; set; }
}

public class UserInfo
{
    public Guid UserId { get; set; }
    public string FullName { get; set; }
    public string UserPermissions { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
}

public class TokenInfo
{
    public string TokenType { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public string Expires { get; set; }
    public int ExpireIn { get; set; }
}