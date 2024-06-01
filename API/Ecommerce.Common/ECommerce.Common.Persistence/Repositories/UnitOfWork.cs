using ECommerce.Common.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Persistence.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly IServiceProvider _serviceProvider;
    private ECommerceDbContext _context;
    private DatabaseFacade _transaction;

    public UnitOfWork(ECommerceDbContext dbContext, 
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _context = dbContext;
        GetContext();
    }

    private ECommerceDbContext GetContext()
    {
        if (_context != null)
        {
            return _context;
        }
        var serviceScope = _serviceProvider.CreateScope();
        _context = serviceScope.ServiceProvider.GetService<ECommerceDbContext>();
        return _context;
    }

    public ECommerceDbContext GetAsyncContext()
    {
        var serviceScope = _serviceProvider.CreateScope();
        return serviceScope.ServiceProvider.GetService<ECommerceDbContext>();
    }

    public DbSet<T> Repository<T>() where T : class
    {
        return _context.Repository<T>();
    }

    public int SaveChanges()
    {
        return _context.SaveChanges();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public DatabaseFacade GetTransaction()
    {
        if (_transaction != null)
        {
            return _transaction;
        }

        var context = GetContext();
        _transaction = context.Database;
        return _transaction;
    }

    public void BeginTransaction()
    {
        GetTransaction().BeginTransaction();
    }

    public async Task BeginTransactionAsync()
    {
        await GetTransaction().BeginTransactionAsync();
    }

    public void CommitTransaction()
    {
        GetTransaction().CommitTransaction();
    }

    public void RollBackTransaction()
    {
        GetTransaction().RollbackTransaction();
    }
}