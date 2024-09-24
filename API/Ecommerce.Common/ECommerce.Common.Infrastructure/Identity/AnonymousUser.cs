namespace ECommerce.Common.Infrastructure.Identity;

public class AnonymousUser : ICurrentUser
{
    public bool IsAuthenticated => false;

    public Guid UserId => Guid.Empty;
}
