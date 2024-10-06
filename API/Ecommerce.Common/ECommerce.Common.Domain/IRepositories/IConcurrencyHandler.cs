namespace ECommerce.Common.Domain.IRepositories;

public interface IConcurrencyHandler<TEntity>
{
    void SetRowVersion(TEntity entity, byte[] version);

    bool IsDbUpdateConcurrencyException(Exception ex);
}
