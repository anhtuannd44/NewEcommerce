using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ECommerce.Common.Infrastructure.Persistence;

namespace ECommerce.Notification.Repositories;

public class NotificationDbContext : DbContextUnitOfWork<NotificationDbContext>
{
    public NotificationDbContext(DbContextOptions<NotificationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
