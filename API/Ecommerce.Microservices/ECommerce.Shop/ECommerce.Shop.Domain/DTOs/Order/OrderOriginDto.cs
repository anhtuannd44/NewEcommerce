using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class OrderOriginListResponseDto : ActionEntityStatusDto
{
    public List<OrderOriginResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class CreateOrUpdateOrderOriginResponseDto : ActionEntityStatusDto
{
    public OrderOriginResponseDto Data { get; set; }
}

public class OrderOriginRequestDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
    public bool? IsActive { get; set; }
}

public class OrderOriginResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}