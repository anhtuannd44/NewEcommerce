using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Products;
using ECommerce.Shop.Domain.IService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
public class ProductController : AdminBaseController
{
    private readonly IProductService _productService;
    private readonly IProductCategoryService _productCategoryService;

    public ProductController(IProductService productService,
        IProductCategoryService productCategoryService,
        ICurrentUser currentUser,
        IConfiguration configuration,
        ILogger<ProductController> logger) : base(configuration, logger, currentUser)
    {
        _productService = productService;
        _productCategoryService = productCategoryService;
    }

    [HttpGet]
    [Route("")]
    public async Task<IActionResult> GetProductListAsync([FromQuery] ProductFilterParamsDto searchDto)
    {
        _logger.LogInformation("Start getting product list - GetProductListAsync");
        try
        {
            var result = await _productService.GetProductListAsync(searchDto);
            _logger.LogInformation("Start getting product list - GetProductListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetProductByIdAsync(Guid id)
    {
        _logger.LogInformation("Start getting product by id - GetProductByIdAsync");
        var result = await _productService.GetProductByIdAsync(id);


        if (!result.IsSuccess)
        {
            _logger.LogError("Failed getting product by id - GetProductByIdAsync");
            return BadRequest(result);
        }

        _logger.LogInformation("Successfully getting product by id - GetProductByIdAsync");
        return Ok(result);
    }

    [HttpPost]
    [Route("createorupdate")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateProduct)]
    public async Task<IActionResult> CreateOrUpdateProductAsync([FromBody] ProductDto productDto)
    {
        var result = await _productService.CreateOrUpdateProductAsync(productDto);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok();
    }

    [HttpDelete]
    [Route("delete")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateProduct)]
    public async Task<IActionResult> DeleteProductAsync(Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "ProductId"));
        }

        var result = await _productService.DeleteProductAsync(id.Value);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return Ok();
    }

    [HttpPost]
    [Route("updatestatus")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateProduct)]
    public async Task<IActionResult> UpdateProductStatusAsync([FromBody] UpdateStatusProductsDto dto)
    {
        var result = await _productService.UpdateProductsStatus(dto);
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return Ok();
    }

    [HttpGet]
    [Route("category")]
    public async Task<IActionResult> GetProductCategoryListAsync()
    {
        try
        {
            var result = await _productCategoryService.GetProductCategoryListAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductCategoryListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("category/{id}")]
    public async Task<IActionResult> GetProductCategoryByIdAsync(Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "ProductCategoryId"));
        }

        var result = await _productCategoryService.GetProductCategoryByIdAsync(id.Value);
        if (result == null)
        {
            return BadRequest(ShopDomainConstants.MessageErrorEntityNotFoundVi);
        }

        return Ok(result);
    }

    [HttpPost]
    [Route("category/createorupdate")]
    public async Task<IActionResult> CreateOrUpdateProductCategoryAsync(ProductCategoryDto dto)
    {
        var result = await _productCategoryService.CreateOrUpdateProductCategoryAsync(dto);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete]
    [Route("category/delete")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateProduct)]
    public async Task<IActionResult> DeleteProductCategoryAsync([FromBody] Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "ProductCategoryId"));
        }

        var result = await _productCategoryService.DeleteProductCategoryAsync(id.Value);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return Ok();
    }

    [HttpGet]
    [Route("tags")]
    public async Task<IActionResult> GetProductTagsAsync()
    {
        try
        {
            var result = await _productService.GetProductTagsAsync();
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductTagsAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("brand")]
    public async Task<IActionResult> GetBrandListAsync()
    {
        try
        {
            var result = await _productService.GetBrandListAsync();
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetBrandListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("brand/createorupdate")]
    public async Task<IActionResult> CreateOrUpdateProductBrandAsync(BrandDto dto)
    {
        var result = await _productService.CreateOrUpdateBrandAsync(dto);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}