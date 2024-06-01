using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Entities.Blog;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Blog;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class BlogCategoryService : BaseService, IBlogCategoryService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public BlogCategoryService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<BlogCategoryService> logger) : base(configuration, logger, unitOfWork)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<BlogCategoryListResponseDto> GetBlogCategoryListAsync()
    {
        var allBlogCategoryList = await _unitOfWork.Repository<BlogCategory>()
            .Include(x => x.BlogCategoryRelations)
            .AsNoTracking()
            .ToListAsync();

        var blogCategoryList = GetChildrenBlogCategory(allBlogCategoryList, allBlogCategoryList.Where(x => x.ParentId == null).ToList());

        var total = allBlogCategoryList.Count;

        return new BlogCategoryListResponseDto
        {
            Data = blogCategoryList,
            Total = total
        };
    }

    public async Task<BlogCategoryDto> GetBlogCategoryByIdAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetBlogCategoryByIdAsync), string.Empty));
        var result = new BlogCategoryDto();

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetBlogCategoryByIdAsync), $"BlogCategoryId {id}"));

            var blogCategory = await _unitOfWork.Repository<BlogCategory>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (blogCategory == null)
            {
                return null;
            }

            // Mapping to the responseDto
            result.Id = blogCategory.Id;
            result.Title = blogCategory.Title;
            result.ShortDescription = blogCategory.ShortDescription;
            result.SeoUrl = blogCategory.SeoUrl;
            result.MetaTitle = blogCategory.MetaTitle;
            result.MetaKeywords = blogCategory.MetaKeywords;
            result.MetaDescription = blogCategory.MetaDescription;
            result.IncludeInSitemap = blogCategory.IncludeInSitemap;
            result.ParentId = blogCategory.ParentId;

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetBlogCategoryByIdAsync), $"BlogCategoryId {id}"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetBlogCategoryByIdAsync)} failed: ");
            return null;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetBlogCategoryByIdAsync), string.Empty));
        return result;
    }

    public async Task<ActionEntityStatusDto> CreateOrUpdateBlogCategoryAsync(BlogCategoryDto blogCategoryDto)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBlogCategoryAsync), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            var isAddNew = blogCategoryDto.Id.IsNullOrEmpty() || !blogCategoryDto.Id.HasValue;

            // Validate the title
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBlogCategoryAsync),
                "Validate the blog category title"));
            if (string.IsNullOrEmpty(blogCategoryDto.Title))
            {
                _logger.LogWarning(string.Format(ShopDomainConstants.MessageErrorRequired, nameof(BlogCategoryDto.Title)));
                result.Message = string.Format(ShopDomainConstants.MessageErrorRequiredVi, nameof(BlogCategoryDto.Title));
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBlogCategoryAsync),
                "Blog category title valid"));

            // Validate the Slug path
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBlogCategoryAsync),
                "Validate the BlogCategorySlug"));
            var isValidSlug = await ValidateBlogCategorySlug(blogCategoryDto.SeoUrl, isAddNew, blogCategoryDto.Id);
            if (!isValidSlug)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorSlug);
                result.Message = ShopDomainConstants.MessageErrorSlugVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBlogCategoryAsync),
                "Validate the BlogCategorySlug"));

            // Add the Blog Category entity
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBlogCategoryAsync),
                "Add the blog category entity"));

            var entity = isAddNew ? new BlogCategory() : await _unitOfWork.Repository<BlogCategory>().FirstOrDefaultAsync(x => x.Id == blogCategoryDto.Id.Value);

            entity.Id = isAddNew ? Guid.NewGuid() : blogCategoryDto.Id.Value;
            entity.Title = blogCategoryDto.Title;
            entity.IncludeInSitemap = blogCategoryDto.IncludeInSitemap ?? true;
            entity.ShortDescription = blogCategoryDto.ShortDescription;
            entity.MetaTitle = blogCategoryDto.MetaTitle;
            entity.MetaKeywords = blogCategoryDto.MetaKeywords;
            entity.MetaDescription = blogCategoryDto.MetaDescription;
            entity.SeoUrl = blogCategoryDto.SeoUrl;
            entity.ParentId = blogCategoryDto.ParentId;

            _ = isAddNew
                ? await _unitOfWork.Repository<BlogCategory>().AddAsync(entity)
                : _unitOfWork.Repository<BlogCategory>().Update(entity);

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBlogCategoryAsync),
                "Add the blog category entity"));

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation($"{nameof(CreateOrUpdateBlogCategoryAsync)} - Update Database Successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrUpdateBlogCategoryAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBlogCategoryAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    public async Task<ActionEntityStatusDto> DeleteBlogCategoryAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteBlogCategoryAsync), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteBlogCategoryAsync), "Get the Blog Category"));
            var blogCategory = await _unitOfWork.Repository<BlogCategory>().FirstOrDefaultAsync(x => x.Id == id);

            if (blogCategory == null)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteBlogCategoryAsync), "Get the Blog Category"));

            _unitOfWork.Repository<BlogCategory>().Remove(blogCategory);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteBlogCategoryAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteBlogCategoryAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    private async Task<bool> ValidateBlogCategorySlug(string slug, bool isAddNew, Guid? blogId = null)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return false;
        }

        return !(isAddNew
            ? await _unitOfWork.Repository<BlogCategory>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug)
            : await _unitOfWork.Repository<BlogCategory>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug && x.Id != blogId));
    }

    private List<BlogCategoryInListCategoryViewResponseDto> GetChildrenBlogCategory(IReadOnlyCollection<BlogCategory> sourceCategories,
        IEnumerable<BlogCategory> currentCategories)
    {
        return currentCategories.Select(item => new BlogCategoryInListCategoryViewResponseDto
            {
                Id = item.Id,
                Title = item.Title,
                ShortDescription = item.ShortDescription,
                SeoUrl = item.SeoUrl,
                Children = GetChildrenBlogCategory(sourceCategories,
                    sourceCategories.Where(x => x.ParentId.HasValue && x.ParentId.Value == item.Id).ToList())
            })
            .ToList();
    }
}