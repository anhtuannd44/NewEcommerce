using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;

namespace ECommerce.Common.Domain.Identity;

public interface IPasswordHasher
{
    bool VerifyHashedPassword(User user, string hashedPassword, string providedPassword);
}