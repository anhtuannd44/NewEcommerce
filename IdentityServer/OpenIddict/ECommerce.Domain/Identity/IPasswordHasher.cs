using ECommerce.Domain.Entities;

namespace ECommerce.Domain.Identity;

public interface IPasswordHasher
{
    bool VerifyHashedPassword(User user, string hashedPassword, string providedPassword);
}
