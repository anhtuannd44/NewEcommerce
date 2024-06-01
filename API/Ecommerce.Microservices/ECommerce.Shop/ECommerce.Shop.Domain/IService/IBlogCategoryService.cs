using ECommerce.Common.Domain.DTOs;
using ECommerce.Shop.Domain.DTOs.Blog;

namespace ECommerce.Shop.Domain.IService;

public interface IBlogCategoryService
{
    /// <summary>
    /// Get All the Blog Category List
    /// </summary>
    /// <returns>Blog Category List</returns>
    Task<BlogCategoryListResponseDto> GetBlogCategoryListAsync();
    
    /// <summary>
    /// Get the Blog Category Item by Id
    /// </summary>
    /// <param name="id">The Guid of Blog Category Item</param>
    /// <returns>The Blog Category Item</returns>
    Task<BlogCategoryDto> GetBlogCategoryByIdAsync(Guid id);
    
    /// <summary>
    /// Add or Edit the blog category item
    /// </summary>
    /// <param name="dto">The dto create/update</param>
    /// <returns>Create/Update status or error message if failed</returns>
    Task<ActionEntityStatusDto> CreateOrUpdateBlogCategoryAsync(BlogCategoryDto dto);

    /// <summary>
    /// Delete the blog category item
    /// </summary>
    /// <param name="id">The dto create/update</param>
    /// <returns>Status of action or error message if failed</returns>
    Task<ActionEntityStatusDto> DeleteBlogCategoryAsync(Guid id);
}