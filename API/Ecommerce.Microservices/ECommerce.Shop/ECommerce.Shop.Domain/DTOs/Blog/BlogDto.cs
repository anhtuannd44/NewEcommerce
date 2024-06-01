namespace ECommerce.Shop.Domain.DTOs.Blog;

public class BlogDto
{
    public Guid? Id { get; set; }
    public string Title { get; set; }
    
    public bool? IncludeInSitemap { get; set; }
    
    public string Body { get; set; }
    
    public string BodyOverview { get; set; }
    
    public bool AllowComments { get; set; }
    
    public string MetaTitle { get; set; }
    
    public string MetaKeywords { get; set; }
    
    public string MetaDescription { get; set; }
    
    public string SeoUrl { get; set; }
    
    public int Status { get; set; }
    
    public string Tags { get; set; }
    
    public List<Guid> BlogCategoryIds { get; set; } = [];
}