using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities.Products;

public class ProductAttributeValue : BaseEntity<Guid>
{
        public Guid ProductAttributeId { get; set; }
        public string Name { get; set; }
        
        public virtual ProductAttribute ProductAttribute { get; set; }
}