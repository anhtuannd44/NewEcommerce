using ECommerce.Common.Domain.IRepositories;
using ECommerce.Notification.Entities;

namespace ECommerce.Notification.Repositories;

public interface ISmsMessageRepository : IRepository<SmsMessage, Guid>
{
}
