using ECommerce.Common.Domain.Entities.Media;

namespace ECommerce.Common.Domain.Entities.Products;

public class ProductFilesMapping : AbstractEntity
{
        /// <summary>
        /// Gets or sets the product id
        /// </summary>
        public Guid ProductId { get; set; }
        
        /// <summary>
        /// Gets or sets the product attribute mapping
        /// </summary>
        public Guid FileId { get; set; }
        
        /// <summary>
        /// Gets or sets the attribute name details
        /// </summary>
        public string Name { get; set; }
        
        public virtual Product Product { get; set; }
        public virtual Files File { get; set; }
}