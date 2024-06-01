using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class OrderTagListResponseDto : ActionEntityStatusDto
{
    public List<string> Data { get; set; }
}