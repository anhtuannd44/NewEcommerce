using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class OrderAttributeListResponseDto : ActionEntityStatusDto
{
    public List<OrderAttributeDto> Data { get; set; }
}

public class OrderAttributeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}

public class CreateOrderAttributeResponseDto : ActionEntityStatusDto
{
    public OrderAttributeDto Data { get; set; }
}