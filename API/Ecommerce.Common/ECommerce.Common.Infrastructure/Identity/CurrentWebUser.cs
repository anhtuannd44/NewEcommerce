using System.Security.Claims;
using ECommerce.Common.Domain.Identity;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Common.Infrastructure.Identity;

public class CurrentWebUser(IHttpContextAccessor context) : ICurrentUser
{
    public bool IsAuthenticated => context.HttpContext.User.Identity.IsAuthenticated;

    public Guid? UserId
    {
        get
        {
            if (context.HttpContext == null)
            {
                return null;
            }
            var userIdString = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                               ?? context.HttpContext.User.FindFirst("sub")?.Value;

            if (Guid.TryParse(userIdString, out var userId))
            {
                return userId;
            }

            return null;

        }
    }

    public string ClientId
    {
        get
        {
            var clientId = context.HttpContext != null && context.HttpContext.User.HasClaim(c => c.Type == "client_id") ? context.HttpContext.User.FindFirst(x => x.Type == "client_id")?.Value : null;

            var grantType = context.HttpContext.User.FindFirst("grant_type")?.Value;

            var sub = context.HttpContext.User.FindFirst(x => x.Type == "sub")?.Value;

            return grantType == null && sub == null ? clientId : null;
        }
    }

    public bool HasClaim(string permissionClaimValue)
    {
        return context.HttpContext != null && context.HttpContext.User.HasClaim(c => c.Value == permissionClaimValue);
    }
}