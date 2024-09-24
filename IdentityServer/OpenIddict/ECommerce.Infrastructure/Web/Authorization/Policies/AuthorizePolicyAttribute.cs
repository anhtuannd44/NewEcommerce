using Microsoft.AspNetCore.Authorization;
using System;

namespace ECommerce.Infrastructure.Web.Authorization.Policies;

public class AuthorizePolicyAttribute : AuthorizeAttribute
{
    public AuthorizePolicyAttribute(Type policy)
        : base(policy.FullName)
    {
    }
}
