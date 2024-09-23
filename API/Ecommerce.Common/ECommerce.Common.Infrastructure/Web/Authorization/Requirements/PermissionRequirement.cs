using Microsoft.AspNetCore.Authorization;

namespace ECommerce.Common.Infrastructure.Web.Authorization.Requirements;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string PermissionName { get; set; }
}

public class PermissionRequirementHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var user = context.User;

        if (user.Identity is { IsAuthenticated: false })
        {
            context.Fail();
            return Task.CompletedTask;
        }

        // TODO: check claims
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}