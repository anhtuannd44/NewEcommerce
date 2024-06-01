using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ECommerce.Common.Infrastructure.Identity;

public class ApplicationUserManager : UserManager<User>
{
    public ApplicationUserManager(
        IOptions<IdentityOptions> optionsAccessor,
        IPasswordHasher<User> passwordHasher,
        IEnumerable<IUserValidator<User>> userValidators,
        IEnumerable<IPasswordValidator<User>> passwordValidators,
        ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors,
        IServiceProvider services,
        ILogger<ApplicationUserManager> logger,
        IUserStore<User> store)
        : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors,
            services, logger)
    {
    }

    public string RandomPasswordForUser(int length)
    {
        var random = new Random();
        var seed = random.Next(1, int.MaxValue);

        const string lowerChars = "abcdefghijkmnopqrstuvwxyz";
        const string upperChars = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
        const string number = "0123456789";
        const string specialCharacters = @"!@#$%^&*?";

        var chars = new char[length];
        var rd = new Random(seed);

        chars[0] = specialCharacters[rd.Next(0, specialCharacters.Length - 1)];

        chars[1] = upperChars[rd.Next(0, upperChars.Length - 1)];

        chars[2] = number[rd.Next(0, number.Length - 1)];

        for (var i = 3; i < length; i++)
        {
            chars[i] = lowerChars[rd.Next(0, lowerChars.Length - 1)];
        }

        return new string(chars);
    }
}