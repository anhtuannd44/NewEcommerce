using ECommerce.Shop.Domain.DTOs.Order;

namespace ECommerce.Shop.Domain.IService;

public interface IOrderService
{
    Task<OrderDetailDto> GetOrderDetailById(Guid id);
    Task<Guid> CreateOrder(OrderDetailDto dto);
    Task<OrderAttributeListResponseDto> GetOrderAttribute();
    Task<OrderOriginListResponseDto> GetOrderOriginListAsync(ProductFilterParamsDto dto);
    Task<CreateOrderAttributeResponseDto> CreateOrderAttributeAsync(string name);
    Task<CreateOrUpdateOrderOriginResponseDto> CreateOrUpdateOrderOriginAsync(OrderOriginRequestDto dto);
    Task<OrderTagListResponseDto> GetOrderTagsAsync();
}