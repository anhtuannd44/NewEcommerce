using Microsoft.AspNetCore.Identity;
using ECommerce.IdentityServer.Entities;

namespace ECommerce.IdentityServer.PasswordValidators;

public class HistoricalPasswordValidator : IPasswordValidator<User>
{
    public Task<IdentityResult> ValidateAsync(UserManager<User> manager, User user, string password)
    {
        if (password!.Contains("testhistoricalpassword"))
        {
            return Task.FromResult(IdentityResult.Failed(new IdentityError
            {
                Code = "HistoricalPassword",
                Description = "HistoricalPasswordValidator testing.",
            }));
        }

        // TODO: check password histories, etc.
        return Task.FromResult(IdentityResult.Success);
    }
}