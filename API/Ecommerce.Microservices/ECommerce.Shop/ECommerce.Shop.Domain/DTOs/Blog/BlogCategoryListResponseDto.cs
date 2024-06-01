namespace ECommerce.Shop.Domain.DTOs.Blog;

public class BlogCategoryListResponseDto
{
    public List<BlogCategoryInListCategoryViewResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class BlogCategoryInListCategoryViewResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string ShortDescription { get; set; }
    public string SeoUrl { get; set; }
    public List<BlogCategoryInListCategoryViewResponseDto> Children { get; set; }
}