using System.Reflection;
using ECommerce.Common.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.AuditLog.Repositories;

public class AuditLogDbContext : DbContextUnitOfWork<AuditLogDbContext>
{
    public AuditLogDbContext(DbContextOptions<AuditLogDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
