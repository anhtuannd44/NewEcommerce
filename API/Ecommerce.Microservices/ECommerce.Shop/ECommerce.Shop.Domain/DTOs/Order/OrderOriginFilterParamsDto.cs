﻿using ECommerce.Common.Domain.DTOs.BaseDto;

namespace ECommerce.Shop.Domain.DTOs.Order;

public class OrderOriginFilterParamsDto : BaseDataSourceRequest
{
    public bool? IsActive { get; set; }
    public string SortName { get; set; }
}