using ECommerce.Domain.Identity;
using System;

namespace ECommerce.Infrastructure.Identity;

public class AnonymousUser : ICurrentUser
{
    public bool IsAuthenticated => false;

    public Guid UserId => Guid.Empty;
}
