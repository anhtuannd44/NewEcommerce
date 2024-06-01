namespace ECommerce.Shop.Domain.DTOs.Blog;

public class UpdateStatusBlogsDto
{
    public List<Guid> BlogIds { get; set; } = [];
    public int Status { get; set; }
}