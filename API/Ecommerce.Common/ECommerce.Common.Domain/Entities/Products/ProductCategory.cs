using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Common.Domain.Entities.Products;

public class ProductCategory : BaseEntity<Guid>
{
        /// <summary>
        /// Gets or sets the name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the short description
        /// </summary>
        public string ShortDescription { get; set; }

        /// <summary>
        /// Gets or sets the meta keywords
        /// </summary>
        public string MetaKeywords { get; set; }

        /// <summary>
        /// Gets or sets the meta description
        /// </summary>
        public string MetaDescription { get; set; }

        /// <summary>
        /// Gets or sets the meta title
        /// </summary>
        public string MetaTitle { get; set; }
        
        /// <summary>
        /// Gets or sets the SeoUrl
        /// </summary>
        public string SeoUrl { get; set; }

        /// <summary>
        /// Gets or sets the list products of category item
        /// </summary>
        public virtual IList<Product> Products { get; set; }
}