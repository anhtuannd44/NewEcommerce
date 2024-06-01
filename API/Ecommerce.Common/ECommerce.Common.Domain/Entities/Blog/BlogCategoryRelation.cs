namespace ECommerce.Common.Domain.Entities.Blog;

public class BlogCategoryRelation : AbstractEntity
{
    /// <summary>
    /// Gets or sets the Blog Id
    /// </summary>
    public Guid BlogId { get; set; }
    
    /// <summary>
    /// Gets or sets the Blog Category Id
    /// </summary>
    public Guid BlogCategoryId { get; set; }
    
    /// <summary>
    /// Gets or sets the Blog
    /// </summary>
    public virtual Blog Blog { get; set; }
    
    /// <summary>
    /// Gets or sets the Blog Category
    /// </summary>
    public virtual BlogCategory BlogCategory { get; set; }
}