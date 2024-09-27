using ECommerce.Storage.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace ECommerce.Storage.Api.Authorization;

public class FileEntryAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, FileEntry>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, FileEntry resource)
    {
        // TODO: check CreatedById
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
