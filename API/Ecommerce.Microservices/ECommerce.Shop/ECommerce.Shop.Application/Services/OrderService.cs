using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.Orders;
using ECommerce.Common.Domain.Entities.Products;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Domain.DTOs.Order;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class OrderService : BaseService, IOrderService
{
    public OrderService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<OrderService> logger) : base(configuration, logger, unitOfWork)
    {
    }

    public async Task<OrderDetailDto> GetOrderDetailById(Guid id)
    {
        var order = await _unitOfWork.Repository<Order>()
            .Where(x => x.Id == id)
            .Include(x => x.OrderOrigin)
            .Include(x => x.ConstructionStaffs)
            .Include(x => x.OrderItems)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return null;
        }

        return new OrderDetailDto
        {
            Id = order.Id,
            OrderCode = order.OrderCode,
            Status = (int)order.Status,
            DateAcceptance = order.DateAcceptance,
            DateAppointedDelivery = order.DateAppointedDelivery,
            DateDelivery = order.DateDelivery,
            DateActualDelivery = order.DateActualDelivery,
            OrderAttributeId = order.OrderAttributeId,
            Note = order.Note,
            PicStaffId = order.PicStaffId,
            ConstructionStaffIds = order.ConstructionStaffs?.Select(x => x.UserId).ToList(),
            PreTotal = order.PreTotal,
            Deposit = order.Deposit,
            Tags = string.IsNullOrEmpty(order.Tags) ? null : order.Tags.Split('-'),
            DiscountValue = order.DiscountValue,
            DiscountType = (int)order.DiscountType,
            TotalPriceAfterDiscount = order.TotalPriceAfterDiscount,
            ShippingFee = order.ShippingFee,
            OrderOriginId = order.OrderOrigin?.Id,

            // Customer information
            CustomerName = order.CustomerName,
            CustomerPhoneNumber = order.CustomerPhoneNumber,
            DeliveryAddress = order.DeliveryAddress,
            BillingAddress = order.BillingAddress,
            CustomerNote = order.CustomerNote,
            CustomerEmail = order.CustomerEmail,
            CustomerId = order.CustomerId,

            // Customer complain
            IsComplain = order.IsComplain,
            Problem = order.Problem,
            RootCause = order.RootCause,
            Solution = order.Solution,
            ResponsibleStaffIds = order.ResponsibleStaffs?.Select(x => x.UserId).ToList(),

            Items = order.OrderItems.Select(x => new OrderItemDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                Price = x.Price,
                Quantity = x.Quantity,
                DiscountType = (int)x.DiscountType,
                DiscountValue = x.DiscountValue,
                Note = x.Note
            }).ToList()
        };
    }

    public async Task<Guid> CreateOrder(OrderDetailDto dto)
    {
        if (string.IsNullOrEmpty(dto.OrderCode))
        {
            dto.OrderCode = GenerateOrderCode();
        }

        var user = await _unitOfWork.Repository<User>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == dto.CustomerId);

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderCode = dto.OrderCode,
            Status = (OrderStatus)(dto.Status ?? 0),
            OrderAttributeId = dto.OrderAttributeId,
            DateDelivery = dto.DateDelivery,
            Note = dto.Note,
            PicStaffId = dto.PicStaffId,
            PreTotal = dto.PreTotal,
            TotalPriceAfterDiscount = dto.TotalPriceAfterDiscount,
            ShippingFee = dto.ShippingFee,
            DeliveryAddress = dto.DeliveryAddress,
            CustomerEmail = dto.CustomerEmail,
            CustomerName = user.FullName,
            CustomerPhoneNumber = user.PhoneNumber,
            CustomerId = user.Id,
            DiscountType = (DiscountType)dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            DiscountNote = dto.DiscountNote,
            Deposit = dto.Deposit,
            IsComplain = dto.IsComplain,
            Problem = dto.Problem,
            Solution = dto.Solution,
            RootCause = dto.RootCause,
            Tags = dto.Tags.Length > 0 ? string.Join('-', dto.Tags) : null,
            OrderOriginId = dto.OrderOriginId
        };

        await _unitOfWork.Repository<Order>().AddAsync(order);

        var orderItems = new List<OrderItem>();

        var productIds = dto.Items.Select(x => x.ProductId);

        var productList = await _unitOfWork.Repository<Product>().Where(x => productIds.Contains(x.Id)).ToListAsync();
        
        dto.ConstructionStaffIds.ForEach(x =>
        {
            _unitOfWork.Repository<ConstructionStaff>().Add(new ConstructionStaff
            {
                UserId = x,
                OrderId = order.Id
            });
        });
        
        dto.ResponsibleStaffIds.ForEach(x =>
        {
            _unitOfWork.Repository<ResponsibleStaff>().Add(new ResponsibleStaff
            {
                UserId = x,
                OrderId = order.Id
            });
        });

        dto.Items.ForEach(x =>
        {
            var currentProduct = productList.FirstOrDefault(p => p.Id == x.ProductId);
            var preTotal = x.Price * x.Quantity;
            var total = preTotal;
            if (x.DiscountValue > 0)
            {
                total = preTotal - ((DiscountType)x.DiscountType == DiscountType.Value
                    ? x.DiscountValue
                    : ((preTotal / 100) * x.DiscountValue
                    ));
            }

            orderItems.Add(new OrderItem
            {
                ProductId = x.ProductId.Value,
                Price = x.Price,
                ProductName = currentProduct?.Name,
                DiscountType = (DiscountType)x.DiscountType,
                DiscountValue = x.DiscountValue,
                Quantity = x.Quantity,
                PreTotal = preTotal,
                PriceAfterDiscount = total,
                Note = x.Note,
                OrderId = order.Id
            });
        });
        await _unitOfWork.Repository<OrderItem>().AddRangeAsync(orderItems);
        await _unitOfWork.SaveChangesAsync();
        return order.Id;
    }

    public async Task<OrderAttributeListResponseDto> GetOrderAttribute()
    {
        var result = new OrderAttributeListResponseDto
        {
            IsSuccess = false
        };
        try
        {
            var orderAttributeList = await _unitOfWork.Repository<OrderAttribute>().AsNoTracking().Select(x =>
                new OrderAttributeDto
                {
                    Id = x.Id,
                    Name = x.Name
                }
            ).ToListAsync();
            result.Data = orderAttributeList;
            result.IsSuccess = true;
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageGetEntitySuccess, nameof(OrderAttribute)));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ShopDomainConstants.MessageErrorSaveDb);
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
        }

        return result;
    }

    public async Task<OrderOriginListResponseDto> GetOrderOriginListAsync(ProductFilterParamsDto dto)
    {
        var result = new OrderOriginListResponseDto
        {
            IsSuccess = false
        };
        try
        {
            var query = _unitOfWork.Repository<OrderOrigin>()
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrEmpty(dto.Keyword))
            {
                query = query.Where(x => x.Name.Contains(dto.Keyword.Trim()));
            }

            if (dto.DateFrom.HasValue)
                query = query.Where(x => dto.DateFrom.Value <= x.CreatedDate);

            if (dto.DateTo.HasValue)
                query = query.Where(x => dto.DateTo.Value >= x.CreatedDate);

            if (dto.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == dto.IsActive.Value);
            }

            query = dto.SortName switch
            {
                "title" => query.OrderByIf(x => x.Name, dto.IsAscending ?? true),
                "isActive" => query.OrderByIf(x => x.IsActive, dto.IsAscending ?? true),
                _ => query.OrderByDescending(x => x.CreatedDate)
            };

            var orderOrigins = await query.ToListAsync();
            if (dto.PageNumber != null && dto.PageSize != null)
            {
                orderOrigins = orderOrigins.Skip((dto.PageNumber.Value - 1) * dto.PageSize.Value).Take(dto.PageSize.Value).ToList();
            }

            var total = await query.CountAsync();

            result.Data = orderOrigins.Select(x => new OrderOriginResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                IsActive = x.IsActive
            }).ToList();
            result.Total = total;
            result.IsSuccess = true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error when getting order origin list: ");
            result.Message = "Error when getting order origin list";
        }

        return result;
    }

    public async Task<CreateOrderAttributeResponseDto> CreateOrderAttributeAsync(string name)
    {
        var result = new CreateOrderAttributeResponseDto
        {
            IsSuccess = false
        };

        if (string.IsNullOrEmpty(name))
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageErrorExistedName, name));
            result.Message = string.Format(ShopDomainConstants.MessageErrorExistedNameVi, name);
            return result;
        }

        var isExistedName = await _unitOfWork.Repository<OrderAttribute>().AsNoTracking().AnyAsync(x => x.Name == name);
        if (isExistedName)
        {
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageErrorExistedName, name));
            result.Message = string.Format(ShopDomainConstants.MessageErrorExistedNameVi, name);
            return result;
        }

        try
        {
            var newId = Guid.NewGuid();
            await _unitOfWork.Repository<OrderAttribute>().AddAsync(new OrderAttribute
            {
                Id = newId,
                Name = name
            });
            await _unitOfWork.SaveChangesAsync();

            result.IsSuccess = true;
            result.Data = new OrderAttributeDto
            {
                Id = newId,
                Name = name
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ShopDomainConstants.MessageErrorSaveDb);
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
        }

        return result;
    }

    public async Task<CreateOrUpdateOrderOriginResponseDto> CreateOrUpdateOrderOriginAsync(OrderOriginRequestDto dto)
    {
        var result = new CreateOrUpdateOrderOriginResponseDto
        {
            IsSuccess = false
        };
        try
        {
            var isEdit = !dto.Id.IsNullOrEmpty();

            if (string.IsNullOrEmpty(dto.Name))
            {
                _logger.LogInformation(string.Format(ShopDomainConstants.MessageErrorRequired, "Name"));
                result.Message = string.Format(ShopDomainConstants.MessageErrorRequiredVi, "Name");
                return result;
            }


            var isExistedName = isEdit
                ? await _unitOfWork.Repository<OrderOrigin>().AsNoTracking().AnyAsync(x => x.Name == dto.Name && x.Id != dto.Id)
                : await _unitOfWork.Repository<OrderOrigin>().AsNoTracking().AnyAsync(x => x.Name == dto.Name);
            if (isExistedName)
            {
                _logger.LogInformation(string.Format(ShopDomainConstants.MessageErrorExistedName, dto.Name));
                result.Message = string.Format(ShopDomainConstants.MessageErrorExistedNameVi, dto.Name);
                return result;
            }

            OrderOrigin entity;

            if (isEdit)
            {
                entity = await _unitOfWork.Repository<OrderOrigin>().FirstOrDefaultAsync(x => x.Id == dto.Id);
                if (entity == null)
                {
                    _logger.LogInformation(ShopDomainConstants.MessageErrorEntityNotFound);
                    result.Message = ShopDomainConstants.MessageErrorEntityNotFoundVi;
                    return result;
                }

                entity.Name = dto.Name;
                entity.IsActive = dto.IsActive ?? false;
                _unitOfWork.Repository<OrderOrigin>().Update(entity);
            }
            else
            {
                entity = new OrderOrigin
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    IsActive = dto.IsActive ?? true
                };
                await _unitOfWork.Repository<OrderOrigin>().AddAsync(entity);
            }

            await _unitOfWork.SaveChangesAsync();

            result.IsSuccess = true;
            result.Data = new OrderOriginResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                IsActive = entity.IsActive
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ShopDomainConstants.MessageErrorSaveDb);
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
        }

        return result;
    }

    public async Task<OrderTagListResponseDto> GetOrderTagsAsync()
    {
        var result = new OrderTagListResponseDto
        {
            IsSuccess = false,
            Data = []
        };
        try
        {
            var orderTagsDb = await _unitOfWork.Repository<Order>().AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.Tags)).Select(x => x.Tags).ToListAsync();

            orderTagsDb.ForEach(x =>
            {
                var tagArray = x.Split('-', StringSplitOptions.RemoveEmptyEntries);
                if (tagArray.Length > 0)
                {
                    result.Data.AddRange(tagArray);
                }
            });

            result.Data = result.Data.Distinct().ToList();
            result.IsSuccess = true;
            _logger.LogInformation(string.Format(ShopDomainConstants.MessageGetEntitySuccess, "OrderTagsList"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ShopDomainConstants.MessageErrorSaveDb);
            result.Message = ShopDomainConstants.MessageErrorSaveDbVi;
        }

        return result;
    }

    private string GenerateOrderCode()
    {
        var now = DateTime.Now;
        var month = (now.Month < 10 ? "0" : "") + now.Month;
        var day = (now.Day < 10 ? "0" : "") + now.Day;
        var hour = (now.Hour < 10 ? "0" : "") + now.Hour;
        var minute = (now.Minute < 10 ? "0" : "") + now.Minute;
        return $"{now.Year}{month}{day}{hour}{minute}";
    }
}