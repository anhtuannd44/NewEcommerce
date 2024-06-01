using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ECommerce.Common.Middleware.Filter
{
    public class RequiredClaimAuthorizeAttribute : TypeFilterAttribute
    {
        public RequiredClaimAuthorizeAttribute(params string[] claimValues) : base(typeof(ClaimRequirementArrayFilter))
        {
            Arguments = new object[] { claimValues.Select(x => new Claim(ClaimTypes.Role, x)).ToArray() };
        }

        public RequiredClaimAuthorizeAttribute(bool isRequiredAllPermission = true, params string[] claimValues) : base(typeof(ClaimRequirementArrayFilter))
        {
            Arguments = new object[] { claimValues.Select(x => new Claim(ClaimTypes.Role, x)).ToArray(), isRequiredAllPermission };
        }
    }

    public class ClaimRequirementArrayFilter : IAuthorizationFilter
    {
        private readonly Claim[] _claim;
        private bool _isRequiredAllPermission;

        public ClaimRequirementArrayFilter(Claim[] claim, bool isRequiredAllPermission = true)
        {
            _claim = claim;
            _isRequiredAllPermission = isRequiredAllPermission;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var hasClaim = _isRequiredAllPermission
                ? _claim.All(c => context.HttpContext.User.HasClaim(claim => claim.Value == c.Value))
                : _claim.Any(c => context.HttpContext.User.HasClaim(claim => claim.Value == c.Value));

            if (!hasClaim)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}