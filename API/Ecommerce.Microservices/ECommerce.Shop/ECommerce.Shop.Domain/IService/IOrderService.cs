using ECommerce.Shop.Domain.DTOs.Order;

namespace ECommerce.Shop.Domain.IService;

public interface IOrderService
{
    Task<OrderDetailDto> GetOrderDetailById(Guid id);
    Task<Guid> CreateOrder(OrderDetailDto dto);
    Task<OrderAttributeListResponseDto> GetOrderAttribute(OrderAttributeFilterParamsDto dto);
    Task<OrderOriginListResponseDto> GetOrderOriginListAsync(OrderOriginFilterParamsDto dto);
    Task<CreateOrderAttributeResponseDto> CreateOrderAttributeAsync(string name);
    Task<CreateOrUpdateOrderOriginResponseDto> CreateOrUpdateOrderOriginAsync(OrderOriginRequestDto dto);
    Task<OrderTagListResponseDto> GetOrderTagsAsync();
}