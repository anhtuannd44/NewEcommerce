using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Blog;
using ECommerce.Shop.Domain.IService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
public class BlogController : AdminBaseController
{
    private readonly IBlogService _blogService;
    private readonly IBlogCategoryService _blogCategoryService;

    public BlogController(IBlogService blogService,
        IBlogCategoryService blogCategoryService,
        ICurrentUser currentUser,
        IConfiguration configuration,
        ILogger<BlogController> logger) : base(configuration, logger, currentUser)
    {
        _blogService = blogService;
        _blogCategoryService = blogCategoryService;
    }

    [HttpGet]
    [Route("")]
    public async Task<IActionResult> GetBlogListAsync([FromQuery] BlogFilterParamsDto searchDto)
    {
        _logger.LogInformation("Start getting blog list - GetBlogListAsync");
        try
        {
            var result = await _blogService.GetBlogListAsync(searchDto);
            _logger.LogInformation("Start getting blog list - GetBlogListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetBlogListAsync)} failed: ");
            return BadRequest();
        }
    }
    
    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetBlogByIdAsync(Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "BlogCategoryId"));
        }

        var result = await _blogService.GetBlogByIdAsync(id.Value);
        if (result == null)
        {
            return BadRequest(ShopDomainConstants.MessageErrorEntityNotFoundVi);
        }

        return Ok(result);
    }

    [HttpPost]
    [Route("createorupdate")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateBlog)]
    public async Task<IActionResult> CreateOrUpdateBlogAsync([FromBody] BlogDto blogDto)
    {
        var result = await _blogService.CreateOrUpdateBlogAsync(blogDto);
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok();
    }
    
    [HttpDelete]
    [Route("delete")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateBlog)]
    public async Task<IActionResult> DeleteBlogAsync(Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "BlogId"));
        }
        
        var result = await _blogService.DeleteBlogAsync(id.Value);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok();
    }
    
    [HttpPost]
    [Route("updatestatus")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateBlog)]
    public async Task<IActionResult> CreateOrUpdateBlogAsync([FromBody] UpdateStatusBlogsDto dto)
    {
        var result = await _blogService.UpdateBlogsStatus(dto);
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok();
    }
    
    [HttpGet]
    [Route("category")]
    public async Task<IActionResult> GetBlogCategoryListAsync()
    {
        _logger.LogInformation("Start getting blog list - GetBlogListAsync");
        try
        {
            var result = await _blogCategoryService.GetBlogCategoryListAsync();
            _logger.LogInformation("Start getting blog list - GetBlogListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetBlogListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpGet]
    [Route("category/{id}")]
    public async Task<IActionResult> GetBlogCategoryByIdAsync(Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "BlogCategoryId"));
        }

        var result = await _blogCategoryService.GetBlogCategoryByIdAsync(id.Value);
        if (result == null)
        {
            return BadRequest(ShopDomainConstants.MessageErrorEntityNotFoundVi);
        }

        return Ok(result);
    }

    [HttpPost]
    [Route("category/createorupdate")]
    public async Task<IActionResult> CreateOrUpdateBlogCategoryAsync(BlogCategoryDto dto)
    {
        var result = await _blogCategoryService.CreateOrUpdateBlogCategoryAsync(dto);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok();
    }
    
    [HttpDelete]
    [Route("category/delete")]
    //[RequiredClaimAuthorize(PermissionClaimTypes.CanCreateBlog)]
    public async Task<IActionResult> DeleteBlogCategoryAsync([FromBody] Guid? id)
    {
        if (id.IsNullOrEmpty() || !id.HasValue)
        {
            return BadRequest(string.Format(ShopDomainConstants.MessageErrorRequiredVi, "BlogCategoryId"));
        }
        
        var result = await _blogCategoryService.DeleteBlogCategoryAsync(id.Value);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok();
    }
}