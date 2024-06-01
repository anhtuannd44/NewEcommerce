namespace ECommerce.Common.Domain.Identity;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    Guid? UserId { get; }

    string ClientId { get; }

    bool HasClaim(string permissionClaimValue);
}