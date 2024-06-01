using System.ComponentModel.DataAnnotations.Schema;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Blog;

public class Blog : AbstractEntity
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
    /// Gets or sets the blog post body
    /// </summary>
    public string Body { get; set; }

    /// <summary>
    /// Gets or sets the blog post overview. If specified, then it's used on the blog page instead of the "Body"
    /// </summary>
    public string BodyOverview { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the blog post comments are allowed 
    /// </summary>
    public bool AllowComments { get; set; }

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
    /// Gets or sets the Tags
    /// </summary>
    public string Tags { get; set; }
    
    /// <summary>
    /// Gets or sets the SEO url path
    /// </summary>
    public BlogStatus Status { get; set; }
    
    /// <summary>
    /// Gets or sets Author
    /// </summary>
    [ForeignKey("CreatedById")]
    public virtual User Author { get; set; }
    
    /// <summary>
    /// Gets or sets Blog Category Relations
    /// </summary>
    public virtual IList<BlogCategoryRelation> BlogCategoryRelations { get; set; }
    
}