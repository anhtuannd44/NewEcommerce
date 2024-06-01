using ECommerce.Common.Domain.DTOs;
using ECommerce.Shop.Domain.DTOs.Blog;

namespace ECommerce.Shop.Domain.IService;

public interface IBlogService
{
    /// <summary>
    /// Get blog list with filtering
    /// </summary>
    /// <param name="searchDto">The dto for filtering</param>
    /// <returns>The Blog List</returns>
    Task<BlogListResponseDto> GetBlogListAsync(BlogFilterParamsDto searchDto);
    
    /// <summary>
    /// Create/Update the Blog Item
    /// </summary>
    /// <param name="id">The Guid of Blog Item</param>
    /// <returns>Status success or failed with error message</returns>
    Task<BlogDto> GetBlogByIdAsync(Guid id);
    
    /// <summary>
    /// Create/Update the Blog Item
    /// </summary>
    /// <param name="blogDto">The Dto for Creating/Updating</param>
    /// <returns>Status success or failed with error message</returns>
    Task<ActionEntityStatusDto> CreateOrUpdateBlogAsync(BlogDto blogDto);
    
    /// <summary>
    /// Delete the Blog Item
    /// </summary>
    /// <param name="id">The Guid of Blog Item</param>
    /// <returns>Status success or failed with error message</returns>
    Task<ActionEntityStatusDto> DeleteBlogAsync(Guid id);

    /// <summary>
    /// Update status of list blog
    /// </summary>
    /// <param name="dto">List BlogId and Status to updating</param>
    /// <returns>Status success or failed with error message</returns>
    public Task<ActionEntityStatusDto> UpdateBlogsStatus(UpdateStatusBlogsDto dto);
}