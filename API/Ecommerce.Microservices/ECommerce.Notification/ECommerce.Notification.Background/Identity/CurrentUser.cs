using ECommerce.Common.Infrastructure.Identity;

namespace ECommerce.Notification.Background.Identity;

public class CurrentUser : ICurrentUser
{
    public bool IsAuthenticated => false;

    public Guid UserId => Guid.Empty;
}
