using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Entities.Blog;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Blog;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class BlogService : BaseService<BlogService>, IBlogService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public BlogService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<BlogService> logger) : base(configuration, unitOfWork, logger)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<BlogListResponseDto> GetBlogListAsync(BlogFilterParamsDto searchDto)
    {
        var query = _unitOfWork.Repository<Blog>()
            .Where(x => x.Status != BlogStatus.Deleted)
            .Include(x => x.BlogCategoryRelations)
            .ThenInclude(x => x.BlogCategory)
            .Include(x => x.Author)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.Keyword))
        {
            query = query.Where(x => x.Title.Contains(searchDto.Keyword.Trim()));
        }

        if (searchDto.DateFrom.HasValue)
            query = query.Where(x => searchDto.DateFrom.Value <= x.CreatedDate);

        if (searchDto.DateTo.HasValue)
            query = query.Where(x => searchDto.DateTo.Value >= x.CreatedDate);

        if (searchDto.Status.HasValue)
        {
            query = query.Where(x => x.Status == (BlogStatus)searchDto.Status.Value);
        }

        query = searchDto.SortName switch
        {
            "title" => query.OrderByIf(x => x.Title, searchDto.IsAscending ?? true),
            "user_created" => query.OrderByIf(x => x.Author.UserName, searchDto.IsAscending ?? true),
            _ => query.OrderByDescending(x => x.CreatedDate)
        };

        var blogListFromDb = await query.ToListAsync();
        if (searchDto.PageNumber != null && searchDto.PageSize != null)
        {
            blogListFromDb = blogListFromDb.Skip((searchDto.PageNumber.Value - 1) * searchDto.PageSize.Value).Take(searchDto.PageSize.Value).ToList();
        }

        var total = await query.CountAsync();
        var blogListResponse = blogListFromDb.Select(x => new BlogInListResponseDto()
        {
            Id = x.Id,
            Title = x.Title,
            BodyOverview = x.BodyOverview,
            SeoUrl = x.SeoUrl,
            Status = (int)x.Status,
            Author = new BlogAuthorDto
            {
                UserId = x.Author.Id,
                FullName = x.Author.FullName,
                Email = x.Author.Email
            },
            BlogCategoryLists = x.BlogCategoryRelations.Select(b => new BlogCategoryInListBlogViewResponseDto()
            {
                Id = b.BlogCategory.Id,
                Title = b.BlogCategory.Title,
                SeoUrl = b.BlogCategory.SeoUrl
            }).ToList()
        }).ToList();

        var result = new BlogListResponseDto
        {
            Data = blogListResponse,
            Total = total
        };
        return result;
    }

    public async Task<BlogDto> GetBlogByIdAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetBlogByIdAsync), string.Empty));
        var result = new BlogDto();

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetBlogByIdAsync), $"BlogId {id}"));

            var blog = await _unitOfWork.Repository<Blog>()
                .AsNoTracking()
                .Where(x => x.Id == id && x.Status != BlogStatus.Deleted)
                .Include(x => x.BlogCategoryRelations)
                .FirstOrDefaultAsync();

            if (blog == null)
            {
                return null;
            }

            // Mapping to the responseDto
            result.Id = blog.Id;
            result.Title = blog.Title;
            result.BodyOverview = blog.BodyOverview;
            result.SeoUrl = blog.SeoUrl;
            result.MetaTitle = blog.MetaTitle;
            result.MetaKeywords = blog.MetaKeywords;
            result.MetaDescription = blog.MetaDescription;
            result.IncludeInSitemap = blog.IncludeInSitemap;
            result.Tags = blog.Tags;
            result.Status = (int)blog.Status;
            result.BlogCategoryIds = blog.BlogCategoryRelations.Select(x => x.BlogCategoryId).ToList();

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetBlogByIdAsync), $"BlogId {id}"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetBlogByIdAsync)} failed: ");
            return null;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetBlogByIdAsync), string.Empty));
        return result;
    }

    public async Task<ActionEntityStatusDto> CreateOrUpdateBlogAsync(BlogDto blogDto)
    {
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            var isAddNew = blogDto.Id.IsNullOrEmpty() || !blogDto.Id.HasValue;

            // Validate the title
            _logger.LogInformation("CreateBlogAsync - Validate the BlogTitle");
            if (string.IsNullOrEmpty(blogDto.Title))
            {
                var errorMessage = string.Format(ShopDomainConstants.MessageErrorRequired, nameof(BlogDto.Title));
                _logger.LogWarning(errorMessage);
                result.Message = errorMessage;
                return result;
            }

            // Validate the Slug path
            _logger.LogInformation("CreateBlogAsync - Validate the BlogSlug");
            var isValidSlug = await ValidateBlogSlug(blogDto.SeoUrl, isAddNew, blogDto.Id);
            if (!isValidSlug)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorSlug);
                result.Message = ShopDomainConstants.MessageErrorSlug;
                return result;
            }

            // Add the Blog entity
            _logger.LogInformation("Start - CreateBlogAsync - Add Blog Entity");

            var entity = isAddNew
                ? new Blog { Id = Guid.NewGuid() }
                : await _unitOfWork.Repository<Blog>().FirstOrDefaultAsync(x => x.Id == blogDto.Id.Value && x.Status != BlogStatus.Deleted);

            if (!isAddNew && entity == null)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorEntityNotFound);
                result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                return result;
            }

            entity.Title = blogDto.Title;
            entity.IncludeInSitemap = blogDto.IncludeInSitemap ?? true;
            entity.Body = blogDto.Body;
            entity.BodyOverview = blogDto.BodyOverview;
            entity.AllowComments = blogDto.AllowComments;
            entity.MetaTitle = blogDto.MetaTitle;
            entity.MetaKeywords = blogDto.MetaKeywords;
            entity.MetaDescription = blogDto.MetaDescription;
            entity.SeoUrl = blogDto.SeoUrl;
            entity.Tags = blogDto.Tags;
            entity.Status = (BlogStatus)blogDto.Status;

            _ = isAddNew
                ? await _unitOfWork.Repository<Blog>().AddAsync(entity)
                : _unitOfWork.Repository<Blog>().Update(entity);

            _logger.LogInformation("End - CreateBlogAsync - Add Blog Entity");

            // Add the Blog Categories
            _logger.LogInformation("Start - CreateBlogAsync - Add Blog Category Relation Entities");

            if (!isAddNew)
            {
                var blogCategoryRelations = await _unitOfWork.Repository<BlogCategoryRelation>()
                    .AsNoTracking()
                    .Where(x => x.BlogId == blogDto.Id.Value)
                    .ToListAsync();

                if (blogCategoryRelations.Count > 0)
                {
                    _unitOfWork.Repository<BlogCategoryRelation>().RemoveRange(blogCategoryRelations);
                }
            }

            if (blogDto.BlogCategoryIds.Count > 0)
            {
                var blogCategoryRelationListToAdd = new List<BlogCategoryRelation>();
                blogDto.BlogCategoryIds.Distinct().ToList().ForEach(x =>
                {
                    blogCategoryRelationListToAdd.Add(new BlogCategoryRelation
                    {
                        BlogId = entity.Id,
                        BlogCategoryId = x
                    });
                });
                await _unitOfWork.Repository<BlogCategoryRelation>().AddRangeAsync(blogCategoryRelationListToAdd);
            }

            _logger.LogInformation("End - CreateBlogAsync - Add Blog Entity");

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("CreateBlogAsync - Update Database Successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CreateBlogAsync failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation("CreateBlogAsync Successfully");
        result.IsSuccess = true;
        return result;
    }

    public async Task<ActionEntityStatusDto> DeleteBlogAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteBlogAsync), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteBlogAsync), "Get the Blog"));
            var entity = await _unitOfWork.Repository<Blog>().FirstOrDefaultAsync(x => x.Id == id && x.Status != BlogStatus.Deleted);

            if (entity == null)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteBlogAsync), "Get the Blog"));

            entity.Status = BlogStatus.Deleted;
            _unitOfWork.Repository<Blog>().Update(entity);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteBlogAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteBlogAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    public async Task<ActionEntityStatusDto> UpdateBlogsStatus(UpdateStatusBlogsDto dto)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(UpdateBlogsStatus), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = ShopDomainConstants.MessageErrorEntityNotFoundVi
        };

        try
        {
            // Validate the input dto
            if (dto.BlogIds.Count == 0)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            if (!Enum.IsDefined(typeof(BlogStatus), dto.Status) || (BlogStatus)dto.Status == BlogStatus.Deleted)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(UpdateBlogsStatus), "Get the Blog List"));
            var entities = await _unitOfWork.Repository<Blog>().Where(x => dto.BlogIds.Contains(x.Id) && x.Status != BlogStatus.Deleted).ToListAsync();

            if (entities.Count == 0)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(UpdateBlogsStatus), "Get the Blog List"));

            entities.ForEach(x => { x.Status = (BlogStatus)dto.Status; });

            _unitOfWork.Repository<Blog>().UpdateRange(entities);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteBlogAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(UpdateBlogsStatus), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    private async Task<bool> ValidateBlogSlug(string slug, bool isAddNew = false, Guid? blogId = null)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return false;
        }

        return !(isAddNew
            ? await _unitOfWork.Repository<Blog>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug)
            : await _unitOfWork.Repository<Blog>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug && x.Id != blogId));
    }
}