using System.Text.Json;
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

public class ProductService : BaseService, IProductService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public ProductService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<ProductService> logger) : base(configuration, logger, unitOfWork)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<ProductListResponseDto> GetProductListAsync(ProductFilterParamsDto searchDto)
    {
        var query = _unitOfWork.Repository<Product>()
            .Where(x => x.Status != ProductStatus.Deleted)
            .Include(x => x.ProductCategory)
            .Include(x => x.MainPicture)
            .Include(x => x.ProductFilesMappings)
            .ThenInclude(x => x.File)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.Keyword))
        {
            query = query.Where(x => x.Name.Contains(searchDto.Keyword.Trim()));
        }

        if (searchDto.DateFrom.HasValue)
            query = query.Where(x => searchDto.DateFrom.Value <= x.CreatedDate);

        if (searchDto.DateTo.HasValue)
            query = query.Where(x => searchDto.DateTo.Value >= x.CreatedDate);

        if (!string.IsNullOrEmpty(searchDto.Status))
        {
            query = query.Where(x => x.Status.GetDescription() == searchDto.Status.ToLower());
        }

        query = searchDto.SortName switch
        {
            "title" => query.OrderByIf(x => x.Name, searchDto.IsAscending ?? true),
            "sku" => query.OrderByIf(x => x.Sku, searchDto.IsAscending ?? true),
            "barCode" => query.OrderByIf(x => x.BarCode, searchDto.IsAscending ?? true),
            _ => query.OrderByDescending(x => x.CreatedDate)
        };

        var productListFromDb = await query.ToListAsync();

        if (searchDto.PageNumber != null && searchDto.PageSize != null)
        {
            productListFromDb = productListFromDb.Skip((searchDto.PageNumber.Value - 1) * searchDto.PageSize.Value).Take(searchDto.PageSize.Value).ToList();
        }

        var total = await query.CountAsync();
        var productListResponse = productListFromDb.Select(x => new ProductInListResponseDto()
        {
            Id = x.Id,
            Name = x.Name,
            BodyOverview = x.Body,
            SeoUrl = x.SeoUrl,
            Status = (int)x.Status,
            Sku = x.Sku,
            BarCode = x.BarCode,
            Price = x.Price,
            ManageStockQuantity = x.ManageStockQuantity,
            StockQuantity = x.StockQuantity,
            MainPicture = (x.FileId != null && x.FileId.Value != Guid.Empty && x.MainPicture != null)
                ? new ProductFileResponseDto
                {
                    FileId = x.FileId.Value,
                    VirtualPath = x.MainPicture.VirtualPath
                }
                : null,
            Album = x.ProductFilesMappings is { Count: > 0 }
                ? x.ProductFilesMappings.Select(p => new ProductFileResponseDto
                {
                    FileId = p.FileId,
                    VirtualPath = p.File.VirtualPath
                }).ToList()
                : null,
            ProductCategory = x.ProductCategory == null
                ? null
                : new ProductCategoryInListProductViewResponseDto
                {
                    Id = x.ProductCategory.Id,
                    Name = x.ProductCategory.Name,
                    SeoUrl = x.ProductCategory.SeoUrl
                }
        }).ToList();

        var result = new ProductListResponseDto
        {
            Data = productListResponse,
            Total = total
        };
        return result;
    }

    public async Task<ProductResponseDto> GetProductByIdAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductByIdAsync), string.Empty));

        var result = new ProductResponseDto();

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductByIdAsync), $"ProductId {id}"));

            var product = await _unitOfWork.Repository<Product>()
                .AsNoTracking()
                .Where(x => x.Id == id && x.Status != ProductStatus.Deleted)
                .Include(x => x.ProductCategory)
                .Include(x => x.ProductAttributes)
                .ThenInclude(x => x.ProductAttributeValues)
                .Include(x => x.ProductAttributeCombinations)
                .Include(x => x.MainPicture)
                .Include(x => x.ProductFilesMappings)
                .ThenInclude(x => x.File)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (product == null)
            {
                const string message = "Product not found";
                _logger.LogInformation($"CreateProductAsync - {message}");
                result.Message = message;
                return result;
            }

            // Mapping to the responseDto
            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Body = product.Body,
                ShortDescription = product.ShortDescription,
                AllowComments = product.AllowComments,
                AllowCustomerReviews = product.AllowCustomerReviews,
                Sku = product.Sku,
                BarCode = product.BarCode,
                ManageStockQuantity = product.ManageStockQuantity,
                StockQuantity = product.StockQuantity,
                CallForPrice = product.CallForPrice,
                Price = product.Price,
                ProductCost = product.ProductCost,
                ProductType = (int)product.ProductType,
                MetaTitle = product.MetaTitle,
                MetaKeywords = product.MetaKeywords,
                MetaDescription = product.MetaDescription,
                SeoUrl = product.SeoUrl,
                Status = (int)product.Status,
                Unit = product.Unit,
                BrandId = product.BrandId,
                ProductCategoryId = product.ProductCategoryId,
                Tags = string.IsNullOrEmpty(product.Tags) ? [] : product.Tags.Split(ShopDomainConstants.TagSplitCharacter),
                MainPicture = product.MainPicture != null
                    ? new ProductPictureDto
                    {
                        FileId = product.MainPicture.Id,
                        VirtualPath = product.MainPicture.VirtualPath
                    }
                    : null,
                Album = product.ProductFilesMappings?.Select(x => new ProductPictureDto
                {
                    FileId = x.FileId,
                    VirtualPath = x.File.VirtualPath
                }).ToList(),
                ProductAttributes = product.ProductAttributes?.Select(x => new ProductAttributeDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ProductAttributeValues = x.ProductAttributeValues?.Select(p => p.Name).ToList()
                }).ToList(),
                ProductAttributeCombinations = product.ProductAttributeCombinations?.Select(x => new ProductAttributeCombinationDto
                {
                    Price = x.Price,
                    ProductCost = x.ProductCost,
                    StockQuantity = x.StockQuantity,
                    Sku = x.Sku,
                    BarCode = x.BarCode,
                    AttributeJson = JsonSerializer.Deserialize<List<AttributesJsonDto>>(x.AttributesJson)
                }).ToList()
            };

            result.Data = productDto;
            result.Message = $"Successfully get product with id: {productDto.Id}";
            result.IsSuccess = true;
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetProductByIdAsync), $"ProductId {id}"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductByIdAsync)} failed: ");
            result.Message = $"Getting product by id {id} failed";
        }

        return result;
    }

    public async Task<ActionEntityStatusDto> CreateOrUpdateProductAsync(ProductDto productDto)
    {
        var result = new ProductResponseDto()
        {
            IsSuccess = false
        };

        try
        {
            if (productDto == null)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorInvalidRequest);
                result.Message = ShopDomainConstants.MessageErrorInvalidRequestVi;
                return result;
            }

            var isAddNew = productDto.Id.IsNullOrEmpty() || !productDto.Id.HasValue;

            // Validate the title
            _logger.LogInformation("CreateProductAsync - Validate the ProductTitle");
            if (string.IsNullOrEmpty(productDto.Name))
            {
                _logger.LogWarning(string.Format(ShopDomainConstants.MessageErrorRequired, nameof(ProductDto.Name)));
                result.Message = string.Format(ShopDomainConstants.MessageErrorRequiredVi, nameof(ProductDto.Name));
                return result;
            }

            // Validate the Slug path
            _logger.LogInformation("CreateProductAsync - Validate the ProductSlug");
            var isValidSlug = await ValidateProductSlug(productDto.SeoUrl, isAddNew, productDto.Id);
            if (!isValidSlug)
            {
                _logger.LogWarning(ShopDomainConstants.MessageErrorSlug);
                result.Message = ShopDomainConstants.MessageErrorSlug;
                return result;
            }

            // Add the Product entity
            _logger.LogInformation("Start - CreateProductAsync - Add Product Entity");

            var productId = Guid.NewGuid();
            Product entity;
            if (isAddNew)
            {
                entity = new Product { Id = productId };
            }
            else
            {
                entity = await _unitOfWork.Repository<Product>().FirstOrDefaultAsync(x => x.Id == productDto.Id.Value && x.Status != ProductStatus.Deleted);

                if (entity == null)
                {
                    _logger.LogWarning(ShopDomainConstants.MessageErrorEntityNotFound);
                    result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                    return result;
                }

                productId = entity.Id;
            }

            // Add general information
            entity.Name = productDto.Name;
            entity.Body = productDto.Body;
            entity.ShortDescription = productDto.ShortDescription;
            entity.AllowComments = productDto.AllowComments;
            entity.MetaTitle = productDto.MetaTitle;
            entity.MetaKeywords = productDto.MetaKeywords;
            entity.MetaDescription = productDto.MetaDescription;
            entity.SeoUrl = productDto.SeoUrl;
            entity.AllowCustomerReviews = productDto.AllowCustomerReviews;
            entity.Sku = productDto.Sku;
            entity.BarCode = productDto.BarCode;
            entity.Tags = productDto.Tags.Length == 0 ? null : string.Join(ShopDomainConstants.TagSplitCharacter, productDto.Tags);
            entity.Status = (ProductStatus)productDto.Status;
            entity.BrandId = productDto.BrandId;
            entity.FileId = productDto.MainPicture.FileId;
            entity.ProductCategoryId = productDto.ProductCategoryId;
            entity.ManageStockQuantity = productDto.ManageStockQuantity;
            entity.CallForPrice = productDto.CallForPrice;
            entity.ProductType = (ProductType)productDto.ProductType;
            entity.StockQuantity = productDto.StockQuantity;
            entity.Price = productDto.Price;
            entity.ProductCost = productDto.ProductCost;

            if (isAddNew)
            {
                await _unitOfWork.Repository<Product>().AddAsync(entity);
            }
            else
            {
                _unitOfWork.Repository<Product>().Update(entity);
                if (entity.ProductFilesMappings.Count > 0)
                {
                    _unitOfWork.Repository<ProductFilesMapping>().RemoveRange(entity.ProductFilesMappings);
                }

                if (entity.ProductAttributeCombinations.Count > 0)
                {
                    _unitOfWork.Repository<ProductAttributeCombination>().RemoveRange(entity.ProductAttributeCombinations);
                }
            }

            if (productDto.ProductAttributeCombinations.Count > 0)
            {
                var (isValid, inValidItem) = ValidateProductAttributeCombinations(productDto.ProductAttributeCombinations);
                if (!isValid)
                {
                    _logger.LogWarning(string.Format(ShopDomainConstants.MessageErrorProductAttributeInvalid, inValidItem.Sku));
                    result.Message = string.Format(ShopDomainConstants.MessageErrorProductAttributeInvalid, inValidItem.Sku);
                    return result;
                }

                if (isAddNew)
                {
                    foreach (var productAttributeCombination in productDto.ProductAttributeCombinations.Select(x => new ProductAttributeCombination
                             {
                                 ProductId = entity.Id,
                                 Price = x.Price,
                                 ProductCost = x.ProductCost,
                                 StockQuantity = x.StockQuantity,
                                 Sku = x.Sku,
                                 BarCode = x.BarCode,
                                 AttributesJson = JsonSerializer.Serialize(x.AttributeJson)
                             }))
                    {
                        await _unitOfWork.Repository<ProductAttributeCombination>().AddAsync(productAttributeCombination);
                    }
                }
            }

            var albumToAddList = productDto.Album.Where(x => x.FileId.HasValue && x.FileId != Guid.Empty).Select(x => new ProductFilesMapping
                {
                    ProductId = productId,
                    FileId = x.FileId.Value
                })
                .ToList();
            if (albumToAddList.Count > 0)
            {
                await _unitOfWork.Repository<ProductFilesMapping>().AddRangeAsync(albumToAddList);
            }


            _logger.LogInformation("End - CreateProductAsync - Add Product Entity");

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("CreateProductAsync - Update Database Successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CreateProductAsync failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
            return result;
        }

        _logger.LogInformation("CreateProductAsync Successfully");
        result.IsSuccess = true;
        return result;
    }

    public async Task<ActionEntityStatusDto> DeleteProductAsync(Guid id)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteProductAsync), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(DeleteProductAsync), "Get the Product"));
            var entity = await _unitOfWork.Repository<Product>().FirstOrDefaultAsync(x => x.Id == id && x.Status != ProductStatus.Deleted);

            if (entity == null)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductAsync), "Get the Product"));

            entity.Status = ProductStatus.Deleted;
            _unitOfWork.Repository<Product>().Update(entity);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteProductAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(DeleteProductAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    public async Task<ActionEntityStatusDto> UpdateProductsStatus(UpdateStatusProductsDto dto)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(UpdateProductsStatus), string.Empty));
        var result = new ActionEntityStatusDto()
        {
            IsSuccess = false,
            Message = ShopDomainConstants.MessageErrorEntityNotFoundVi
        };

        try
        {
            // Validate the input dto
            if (dto.ProductIds.Count == 0)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            if (!Enum.IsDefined(typeof(ProductStatus), dto.Status) || (ProductStatus)dto.Status == ProductStatus.Deleted)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(UpdateProductsStatus), "Get the Product List"));
            var entities = await _unitOfWork.Repository<Product>().Where(x => dto.ProductIds.Contains(x.Id) && x.Status != ProductStatus.Deleted).ToListAsync();

            if (entities.Count == 0)
            {
                _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(UpdateProductsStatus), "Get the Product List"));

            entities.ForEach(x => { x.Status = (ProductStatus)dto.Status; });

            _unitOfWork.Repository<Product>().UpdateRange(entities);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(DeleteProductAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDb;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(UpdateProductsStatus), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    public async Task<ProductTagListResponseDto> GetProductTagsAsync()
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductTagsAsync), string.Empty));
        var result = new ProductTagListResponseDto()
        {
            Data = [],
            IsSuccess = false,
            Message = string.Empty
        };
        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductTagsAsync), "Get Product Tags in Database"));
            var productTags = await _unitOfWork.Repository<Product>()
                .AsNoTracking()
                .Select(x => x.Tags)
                .ToListAsync();
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetProductTagsAsync), "Get Product Tags in Database Successfully"));

            if (productTags.Count == 0)
            {
                result.IsSuccess = true;
                return result;
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductTagsAsync), "Split tag to array"));

            productTags.ForEach(x =>
            {
                if (string.IsNullOrEmpty(x)) return;
                var tagArray = x.Split(ShopDomainConstants.TagSplitCharacter, StringSplitOptions.RemoveEmptyEntries);
                if (tagArray.Length > 0)
                {
                    result.Data.AddRange(tagArray);
                }
            });
            result.IsSuccess = true;
            result.Data = result.Data.Distinct().ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetProductTagsAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(GetProductTagsAsync), "Successfully"));

        return result;
    }

    public async Task<BrandListResponseDto> GetBrandListAsync()
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(GetProductTagsAsync), string.Empty));
        var result = new BrandListResponseDto()
        {
            IsSuccess = false,
            Message = string.Empty
        };
        try
        {
            var brands = await _unitOfWork.Repository<Brand>()
                .AsNoTracking()
                .ToListAsync();
            if (brands.Count == 0)
            {
                return result;
            }

            result.Data = brands.Select(x => new BrandDto
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
            result.IsSuccess = true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrUpdateBrandAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
            return result;
        }

        return result;
    }

    public async Task<BrandResponseDto> CreateOrUpdateBrandAsync(BrandDto dto)
    {
        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBrandAsync), string.Empty));
        var result = new BrandResponseDto()
        {
            IsSuccess = false
        };

        try
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationStart, nameof(CreateOrUpdateBrandAsync), "Validate Data"));
            var isEdit = !dto.Id.IsNullOrEmpty();

            if (string.IsNullOrEmpty(dto.Name))
            {
                _logger.LogInformation(string.Format(ShopDomainConstants.MessageErrorRequired, nameof(dto.Name)));
                result.Message = ShopDomainConstants.MessageErrorRequiredVi;
                return result;
            }

            Brand entity;

            if (isEdit)
            {
                entity = await _unitOfWork.Repository<Brand>().FirstOrDefaultAsync(x => x.Id == dto.Id);
                if (entity == null)
                {
                    _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                    result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                    return result;
                }

                entity.Name = dto.Name;
                _unitOfWork.Repository<Brand>().Update(entity);
            }
            else
            {
                entity = new Brand
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name
                };
                await _unitOfWork.Repository<Brand>().AddAsync(entity);
            }

            _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBrandAsync), "Validate Data"));
            await _unitOfWork.SaveChangesAsync();
            result.Data = new BrandDto
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(CreateOrUpdateBrandAsync)} failed: ");
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
            return result;
        }

        _logger.LogInformation(string.Format(ShopDomainConstants.MessageInformationEnd, nameof(CreateOrUpdateBrandAsync), "Successfully"));
        result.IsSuccess = true;
        return result;
    }

    private async Task<bool> ValidateProductSlug(string slug, bool isAddNew = false, Guid? productId = null)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return false;
        }

        return !(isAddNew
            ? await _unitOfWork.Repository<Product>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug)
            : await _unitOfWork.Repository<Product>().AsNoTracking().AnyAsync(x => x.SeoUrl == slug && x.Id != productId));
    }

    private (bool, ProductAttributeCombinationDto) ValidateProductAttributeCombinations(List<ProductAttributeCombinationDto> list)
    {
        var newListCheck = new HashSet<ProductAttributeCombinationDto>();
        foreach (var item in list)
        {
            if (!newListCheck.Add(item))
            {
                return (false, item);
            }

            var listItemCheck = new HashSet<AttributesJsonDto>();
            var hashSetProductAttributeIds = new HashSet<Guid>();
            foreach (var childItem in item.AttributeJson)
            {
                if (!listItemCheck.Add(childItem) || !hashSetProductAttributeIds.Add(childItem.ProductAttributeId))
                {
                    return (false, item);
                }
            }
        }

        return (true, null);
    }
}