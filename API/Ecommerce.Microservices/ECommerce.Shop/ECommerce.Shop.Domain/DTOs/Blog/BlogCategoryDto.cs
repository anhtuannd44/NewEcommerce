namespace ECommerce.Shop.Domain.DTOs.Blog;

public class BlogCategoryDto
{
    public Guid? Id { get; set; }
    public string Title { get; set; }
    public bool? IncludeInSitemap { get; set; }
    public string ShortDescription { get; set; }
    public string MetaTitle { get; set; }
    public string MetaKeywords { get; set; }
    public string MetaDescription { get; set; }
    public string SeoUrl { get; set; }
    public Guid? ParentId { get; set; }
}