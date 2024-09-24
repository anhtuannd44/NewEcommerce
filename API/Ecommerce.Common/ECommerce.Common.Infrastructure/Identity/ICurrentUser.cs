namespace ECommerce.Common.Infrastructure.Identity;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    Guid UserId { get; }
}
