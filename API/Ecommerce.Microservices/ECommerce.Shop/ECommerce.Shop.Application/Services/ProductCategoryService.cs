using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.DTOs;
using ECommerce.Common.Domain.Entities.Products;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Products;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class ProductCategoryService : BaseService<ProductCategoryService>, IProductCategoryService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public ProductCategoryService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<ProductCategoryService> logger) : base(configuration, unitOfWork, logger)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<ProductCategoryListResponseDto> GetProductCategoryListAsync()
    {
        var productCategoryList = await _unitOfWork.Repository<ProductCategory>()
            .AsNoTracking()
            .Select(x => new ProductCategoryInListCategoryViewResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                SeoUrl = x.SeoUrl
            })
            .ToListAsync();

        var total = productCategoryList.Count;

        return new ProductCategoryListResponseDto
        {
            Data = productCategoryList,
            Total = total
        };
    }

    public async Task<ProductCategoryDto> GetProductCategoryByIdAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductCategoryByIdAsync), string.Empty));
        var result = new ProductCategoryDto();

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductCategoryByIdAsync), $"ProductCategoryId {id}"));

            var productCategory = await _unitOfWork.Repository<ProductCategory>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (productCategory == null)
            {
                return null;
            }

            // Mapping to the responseDto
            result.Id = productCategory.Id;
            result.Name = productCategory.Name;
            result.ShortDescription = productCategory.ShortDescription;
            result.SeoUrl = productCategory.SeoUrl;
            result.MetaTitle = productCategory.MetaTitle;
            result.MetaKeywords = productCategory.MetaKeywords;
            result.MetaDescription = productCategory.MetaDescription;

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetProductCategoryByIdAsync), $"ProductCategoryId {id}"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductCategoryByIdAsync)} failed: ");
            return null;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetProductCategoryByIdAsync), string.Empty));
        return result;
    }

    public async Task<ProductCategoryResponseDto> CreateOrUpdateProductCategoryAsync(ProductCategoryDto productCategoryDto)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateProductCategoryAsync), string.Empty));
        var result = new ProductCategoryResponseDto()
        {
            IsSuccess = false
        };

        try
        {
            var isAddNew = productCategoryDto.Id.IsNullOrEmpty() || !productCategoryDto.Id.HasValue;

            // Validate the title
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateProductCategoryAsync), "Validate the product category title"));
            if (string.IsNullOrEmpty(productCategoryDto.Name))
            {
                _logger.LogWarning(string.Format(ShopDomainConstants.MessageErrorRequired, nameof(ProductCategoryDto.Name)));
                result.Message = string.Format(ShopDomainConstants.MessageErrorRequiredVi, nameof(ProductCategoryDto.Name));
                return result;
            }

            if (await IsExistedProductCategoryName(productCategoryDto.Name, isAddNew, productCategoryDto.Id))
            {
                _logger.LogWarning(string.Format(ShopDomainConstants.MessageErrorExistedName, productCategoryDto.Name));
                result.Message = string.Format(ShopDomainConstants.MessageErrorExistedNameVi, productCategoryDto.Name);
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateProductCategoryAsync), "Product category title valid"));

            // Validate the Slug path
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateProductCategoryAsync), "Validate the ProductCategorySlug"));
            var isValidSlug = await ValidateProductCategorySlug(productCategoryDto.SeoUrl, isAddNew, productCategoryDto.Id);
            if (!isValidSlug)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorSlug);
                result.Message = ShopDomainConstants.MessageErrorSlugVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateProductCategoryAsync), "Validate the ProductCategorySlug"));

            // Add the Product Category entity
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateProductCategoryAsync), "Add the product category entity"));

            var entity = isAddNew
                ? new ProductCategory()
                : await _unitOfWork.Repository<ProductCategory>().FirstOrDefaultAsync(x => x.Id == productCategoryDto.Id.Value);

            entity.Id = isAddNew ? Guid.NewGuid() : productCategoryDto.Id.Value;
            entity.Name = productCategoryDto.Name;
            entity.ShortDescription = productCategoryDto.ShortDescription;
            entity.MetaTitle = productCategoryDto.MetaTitle;
            entity.MetaKeywords = productCategoryDto.MetaKeywords;
            entity.MetaDescription = productCategoryDto.MetaDescription;
            entity.SeoUrl = productCategoryDto.SeoUrl;

            _ = isAddNew
                ? await _unitOfWork.Repository<ProductCategory>().AddAsync(entity)
                : _unitOfWork.Repository<ProductCategory>().Update(entity);

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateProductCategoryAsync),
                "Add the product category entity"));

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation($"{nameof(CreateOrUpdateProductCategoryAsync)} - Update Database Successfully");

            result.Data = new ProductCategoryDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ShortDescription = entity.ShortDescription,
                MetaTitle = entity.MetaTitle,
                MetaKeywords = entity.MetaKeywords,
                MetaDescription = entity.MetaDescription,
                SeoUrl = entity.SeoUrl
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrUpdateProductCategoryAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(ShopDomainConstants.MessageSuccessEntityCreated);
        result.IsSuccess = true;
        result.Message = ShopDomainConstants.MessageSuccessEntityCreatedVi;
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateProductCategoryAsync), "Successfully"));
        return result;
    }

    public async Task<ActionEntityStatusDto> DeleteProductCategoryAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteProductCategoryAsync), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteProductCategoryAsync), "Get the Product Category"));
            var productCategory = await _unitOfWork.Repository<ProductCategory>().FirstOrDefaultAsync(x => x.Id == id);

            if (productCategory == null)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductCategoryAsync), "Get the Product Category"));

            // Set the NULL for ProductCategoryId for all the Product Items in this Category
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteProductCategoryAsync), "Get the Products in this Category"));

            var products = await _unitOfWork.Repository<Product>().Where(x => x.ProductCategoryId == id && x.Status != ProductStatus.Deleted).ToListAsync();
            if (products.Count > 0)
            {
                products.ForEach(x => { x.ProductCategoryId = null; });
                _unitOfWork.Repository<Product>().UpdateRange(products);
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductCategoryAsync), "Get the Products in this Category"));

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductCategoryAsync), "Remove Category in Database"));
            _unitOfWork.Repository<ProductCategory>().Remove(productCategory);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteProductCategoryAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductCategoryAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    #region Private Methods

    private async Task<bool> IsExistedProductCategoryName(string name, bool isAddNew, Guid? productId)
    {
        return isAddNew
            ? await _unitOfWork.Repository<ProductCategory>().AsNoTracking().AnyAsync(x => x.Name == name)
            : await _unitOfWork.Repository<ProductCategory>().AsNoTracking().AnyAsync(x => x.Name == name && x.Id != productId);
    }

    private async Task<bool> ValidateProductCategorySlug(string slug, bool isAddNew, Guid? productId = null)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return false;
        }

        return !(isAddNew
            ? await _unitOfWork.Repository<ProductCategory>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug)
            : await _unitOfWork.Repository<ProductCategory>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug && x.Id != productId));
    }

    #endregion
}