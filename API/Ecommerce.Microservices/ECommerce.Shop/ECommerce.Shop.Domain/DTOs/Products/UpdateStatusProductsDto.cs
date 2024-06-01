namespace ECommerce.Shop.Domain.DTOs.Products;

public class UpdateStatusProductsDto
{
    public List<Guid> ProductIds { get; set; } = [];
    public int Status { get; set; }
}