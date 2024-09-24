using ECommerce.Notification.Entities;
using ECommerce.Common.Domain.IRepositories;

namespace ECommerce.Notification.Repositories;

public interface IEmailMessageRepository : IRepository<EmailMessage, Guid>
{
}
