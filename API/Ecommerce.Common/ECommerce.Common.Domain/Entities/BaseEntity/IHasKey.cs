namespace ECommerce.Common.Domain.Entities.BaseEntity;

public interface IHasKey<T>
{
    T Id { get; set; }
}