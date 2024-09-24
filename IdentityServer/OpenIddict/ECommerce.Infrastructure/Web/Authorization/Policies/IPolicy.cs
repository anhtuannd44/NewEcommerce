using Microsoft.AspNetCore.Authorization;

namespace ECommerce.Infrastructure.Web.Authorization.Policies;

public interface IPolicy
{
    void Configure(AuthorizationPolicyBuilder policy);
}
