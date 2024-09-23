using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities.Products;

public class ProductAttribute : BaseEntity<Guid>
{
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public Guid ProductId { get; set; }

    public Product Product { get; set; }
    public virtual IList<ProductAttributeValue> ProductAttributeValues { get; set; }
}