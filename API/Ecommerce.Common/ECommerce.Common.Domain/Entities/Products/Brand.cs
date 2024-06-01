
namespace ECommerce.Common.Domain.Entities.Products;

public class Brand : AbstractEntity
{
        /// <summary>
        /// Gets or sets the brand name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the list products
        /// </summary>
        public virtual IList<Product> Products { get; set; }
}