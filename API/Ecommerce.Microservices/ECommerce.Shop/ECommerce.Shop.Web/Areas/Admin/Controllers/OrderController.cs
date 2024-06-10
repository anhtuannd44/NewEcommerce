using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain.DTOs.Order;
using ECommerce.Shop.Domain.IService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
public class OrderController : AdminBaseController
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService,
        ICurrentUser currentUser,
        IConfiguration configuration,
        ILogger<OrderController> logger) : base(configuration, logger, currentUser)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [Route("getOrderDetailById")]
    public async Task<IActionResult> GetOrderDetailById([FromQuery] Guid id)
    {
        _logger.LogInformation("Start getting product list - GetProductListAsync");
        try
        {
            var result = await _orderService.GetOrderDetailById(id);
            _logger.LogInformation("Start getting product list - GetProductListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetOrderDetailById)} failed: ");
            return BadRequest();
        }
    }


    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateOrder([FromBody] OrderDetailDto dto)
    {
        var id = await _orderService.CreateOrder(dto);
        return Ok(id);
    }

    [HttpGet]
    [Route("attribute")]
    public async Task<IActionResult> GetOrderAttributeList([FromQuery] OrderAttributeFilterParamsDto dto)
    {
        _logger.LogInformation("Start getting order attribute list - GetOrderAttributeList");
        try
        {
            var result = await _orderService.GetOrderAttribute(dto);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            _logger.LogInformation("End getting order attribute - GetOrderAttributeList");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetOrderAttributeList)} failed: ");
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("attribute/create")]
    public async Task<IActionResult> CreateOrderAttributeAsync(string name)
    {
        try
        {
            var result = await _orderService.CreateOrderAttributeAsync(name);
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrderAttributeAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("orderOrigin")]
    public async Task<IActionResult> GetOrderOriginListAsync([FromQuery] OrderOriginFilterParamsDto dto)
    {
        try
        {
            var result = await _orderService.GetOrderOriginListAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetOrderOriginListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("orderOrigin/createOrUpdate")]
    public async Task<IActionResult> CreateOrUpdateOrderOriginAsync([FromBody] OrderOriginRequestDto dto)
    {
        try
        {
            var result = await _orderService.CreateOrUpdateOrderOriginAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrUpdateOrderOriginAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("tags")]
    public async Task<IActionResult> GetOrderTagsAsync()
    {
        _logger.LogInformation("Start getting order attribute list - GetOrderTagsAsync");
        try
        {
            var result = await _orderService.GetOrderTagsAsync();
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            _logger.LogInformation("End getting order attribute - GetOrderTagsAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetOrderTagsAsync)} failed: ");
            return BadRequest();
        }
    }
}