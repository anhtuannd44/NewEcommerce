namespace ECommerce.Shop.Domain.DTOs.Blog;

public class BlogListResponseDto
{
    public List<BlogInListResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class BlogInListResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string BodyOverview { get; set; }
    public string SeoUrl { get; set; }
    public int Status { get; set; }
    public BlogAuthorDto Author { get; set; }
    public List<BlogCategoryInListBlogViewResponseDto> BlogCategoryLists { get; set; }
}

public class BlogCategoryInListBlogViewResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string BodyOverview { get; set; }
    public string SeoUrl { get; set; }
}

public class BlogAuthorDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
}