using System.Security.Claims;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Persistence;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;

namespace ECommerce.Common.Middleware.ClaimsTransformations;

public class CustomClaimsTransformation(ECommerceDbContext context, IMemoryCache cache) : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        var identity = principal.Identities.FirstOrDefault(x => x.IsAuthenticated);

        if (identity == null)
        {
            return Task.FromResult(principal);
        }
        var userIdClaim = principal.Claims.Any() ? principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier) : null;

        Guid.TryParse(userIdClaim?.Value, out var userId);
        var issuedAt = principal.Claims.FirstOrDefault(x => x.Type == "iat")?.Value;
        var cacheKey = $"{userId}-{issuedAt}";
        var claims = new List<Claim>();

        if (cache.TryGetValue(cacheKey, out List<Claim> cacheClaims))
        {
            claims.AddRange(cacheClaims);
        }
        else
        {
            var permissions = GetPermissionsAsync(userId).Result;
            claims.AddRange(permissions.Select(p => new Claim(ClaimTypes.Role, p)));
            cache.Set(cacheKey, claims);
        }
        claims.AddRange(principal.Claims);
        var newIdentity = new ClaimsIdentity(claims, identity.AuthenticationType);

        return Task.FromResult(new ClaimsPrincipal(newIdentity));
    }

    protected virtual Task<IList<string>> GetPermissionsAsync(Guid userId)
    {
        var userInfo = context.Set<User>().Where(c => c.Id == userId);

        var roles = userInfo.SelectMany(u => u.UserRoles);

        var permissionClaims = roles.SelectMany(r => r.Role.Permissions).Select(p => p.PermissionValue).Distinct().ToList();

        return Task.FromResult<IList<string>>(permissionClaims);
    }
}