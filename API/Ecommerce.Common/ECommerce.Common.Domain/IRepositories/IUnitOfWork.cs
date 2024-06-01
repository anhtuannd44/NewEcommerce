using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ECommerce.Common.Domain.IRepositories;

public interface IUnitOfWork
{
    DbSet<T> Repository<T>() where T : class;
    int SaveChanges();
    Task<int> SaveChangesAsync();
    void BeginTransaction();
    Task BeginTransactionAsync();
    void CommitTransaction();
    void RollBackTransaction();
}