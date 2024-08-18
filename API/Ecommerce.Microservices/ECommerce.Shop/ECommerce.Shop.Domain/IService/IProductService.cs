using ECommerce.Common.Domain.DTOs;
using ECommerce.Shop.Domain.DTOs.Products;

namespace ECommerce.Shop.Domain.IService;

public interface IProductService
{
    /// <summary>
    /// Get product list with filtering
    /// </summary>
    /// <param name="searchDto">The dto for filtering</param>
    /// <returns>The Product List</returns>
    Task<ProductListResponseDto> GetProductListAsync(ProductFilterParamsDto searchDto);

    /// <summary>
    /// Create/Update the Product Item
    /// </summary>
    /// <param name="id">The Guid of Product Item</param>
    /// <returns>Status success or failed with error message</returns>
    Task<ProductResponseDto> GetProductByIdAsync(Guid id);

    /// <summary>
    /// Create/Update the Product Item
    /// </summary>
    /// <param name="productDto">The Dto for Creating/Updating</param>
    /// <returns>Status success or failed with error message</returns>
    Task<ActionEntityStatusDto> CreateOrUpdateProductAsync(ProductDto productDto);

    /// <summary>
    /// Delete the Product Item
    /// </summary>
    /// <param name="id">The Guid of Product Item</param>
    /// <returns>Status success or failed with error message</returns>
    Task<ActionEntityStatusDto> DeleteProductAsync(Guid id);

    /// <summary>
    /// Update status of list product
    /// </summary>
    /// <param name="dto">List ProductId and Status to updating</param>
    /// <returns>Status success or failed with error message</returns>
    public Task<ActionEntityStatusDto> UpdateProductsStatus(UpdateStatusProductsDto dto);

    /// <summary>
    /// Get product tags
    /// </summary>
    /// <returns>All tags list</returns>
    Task<ProductTagListResponseDto> GetProductTagsAsync();

    /// <summary>
    /// Get the brand list
    /// </summary>
    /// <returns>All brands list</returns>
    Task<BrandListResponseDto> GetBrandListAsync();

    /// <summary>
    /// Create/Update Product Brand
    /// </summary>
    /// <param name="dto">BrandDto request</param>
    /// <returns>Brand after create/update</returns>
    Task<BrandResponseDto> CreateOrUpdateBrandAsync(BrandDto dto);
}