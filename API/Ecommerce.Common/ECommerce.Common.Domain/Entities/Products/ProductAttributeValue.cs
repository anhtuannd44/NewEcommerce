namespace ECommerce.Common.Domain.Entities.Products;

public class ProductAttributeValue : AbstractEntity
{
        public Guid ProductAttributeId { get; set; }
        public string Name { get; set; }
        
        public virtual ProductAttribute ProductAttribute { get; set; }
}