using ECommerce.Common.Domain.Entities.BaseEntity;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Blog;

public class BlogCategory : BaseEntity<Guid>, IAggregateRoot
{
    /// <summary>
    /// Gets or sets the blog post title
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Gets or sets the value indicating whether this blog post should be included in sitemap
    /// </summary>
    public bool IncludeInSitemap { get; set; }
    
    /// <summary>
    /// Gets or sets the value indicating whether this blog post should be included in sitemap
    /// </summary>
    public string ShortDescription { get; set; }

    /// <summary>
    /// Gets or sets the meta title
    /// </summary>
    public string MetaTitle { get; set; }
    
    /// <summary>
    /// Gets or sets the meta keywords
    /// </summary>
    public string MetaKeywords { get; set; }

    /// <summary>
    /// Gets or sets the meta description
    /// </summary>
    public string MetaDescription { get; set; }
    
    /// <summary>
    /// Gets or sets the SEO url path
    /// </summary>
    public string SeoUrl { get; set; }
    
    /// <summary>
    /// Gets or sets the Parent Blog Category Id
    /// </summary>
    public Guid? ParentId { get; set; }
    
    /// <summary>
    /// Gets or sets Blog Category Relations
    /// </summary>
    public virtual IList<BlogCategoryRelation> BlogCategoryRelations { get; set; }
}