using ECommerce.Common.Domain.DTOs;
using ECommerce.Shop.Domain.DTOs.Products;

namespace ECommerce.Shop.Domain.IService;

public interface IProductCategoryService
{
    /// <summary>
    /// Get product category list and sort
    /// </summary>
    /// <returns>The Product List</returns>
    Task<ProductCategoryListResponseDto> GetProductCategoryListAsync();
    
    /// <summary>
    /// Get product category item by Id
    /// </summary>
    /// <returns>The Product List</returns>
    Task<ProductCategoryDto> GetProductCategoryByIdAsync(Guid id);

    /// <summary>
    /// Create or Update the Product Category
    /// </summary>
    /// <param name="productCategoryDto"></param>
    /// <returns></returns>
    Task<ProductCategoryResponseDto> CreateOrUpdateProductCategoryAsync(ProductCategoryDto productCategoryDto);

    /// <summary>
    /// Delete the product category item
    /// </summary>
    /// <param name="id">The dto create/update</param>
    /// <returns>Status of action or error message if failed</returns>
    Task<ActionEntityStatusDto> DeleteProductCategoryAsync(Guid id);
}