using Microsoft.EntityFrameworkCore;
using ECommerce.Common.CrossCuttingConcerns.OS;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Identity;
using System.Reflection;

namespace ECommerce.Common.Persistence;

public class ECommerceDbContext : DbContext
{
    private readonly IDateTimeServiceProvider _dateTimeProvider;
    private readonly ICurrentUser _currentUser;

    public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options,
        IDateTimeServiceProvider dateTimeProvider,
        ICurrentUser currentUser) : base(options)
    {
        _dateTimeProvider = dateTimeProvider;
        _currentUser = currentUser;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public virtual DbSet<T> Repository<T>() where T : class
    {
        return Set<T>();
    }

    public override int SaveChanges()
    {
        PopulateIdentity();
        return base.SaveChanges();
    }
    
    public async Task<int> SaveChangesAsync()
    {
        PopulateIdentity();
        return await base.SaveChangesAsync();
    }

    private void PopulateIdentity()
    {
        var userId = _currentUser.UserId;
        var entities = ChangeTracker.Entries<AbstractEntity>();
        foreach (var entity in entities.Where(e => e.State is EntityState.Added or EntityState.Modified))
        {
            if (entity.State == EntityState.Added)
            {
                entity.Entity.CreatedDate = _dateTimeProvider.UtcNow;
                entity.Entity.UpdatedDate = _dateTimeProvider.UtcNow;
                if (userId == null)
                {
                    continue;
                }

                entity.Entity.CreatedById = userId;
                entity.Entity.UpdatedById = userId;
            }
            else
            {
                entity.Entity.UpdatedDate = _dateTimeProvider.UtcNow;
                if (userId == null)
                {
                    continue;
                }

                entity.Entity.UpdatedById = userId;
            }
        }
    }
}