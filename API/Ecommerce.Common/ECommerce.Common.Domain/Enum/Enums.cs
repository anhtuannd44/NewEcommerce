using System.ComponentModel;

namespace ECommerce.Common.Domain.Enum;

public enum PermissionType
{
    Create = 0,
    Update = 1,
    Read = 2,
    Delete = 3,
    Approve = 4
}

public enum ShowLogLevel
{
    Default = 0,
    Production = 1,
    Stacktrace = 2
}

public enum EmailType
{
    NewUserEmail = 0,
    ForgotPasswordEmail = 1,
    AccountLockout = 2
}

public enum BlogStatus
{
    Published = 0,
    Drafted = 1,
    Archived = 2,
    Deleted = 3
}

public enum BlogCategoryStatus
{
    Published = 0,
    Drafted = 1,
    Archived = 2,
    Deleted = 3
}

/// <summary>
/// Represents a product type
/// </summary>
public enum ProductType
{
    /// <summary>
    /// Simple
    /// </summary>
    [Description("SimpleProduct")] SimpleProduct = 0,

    /// <summary>
    /// Grouped (product with variants)
    /// </summary>
    [Description("GroupedProduct")] GroupedProduct = 1,
}

public enum ProductStatus
{
    Drafted = 0,
    Published = 1,
    Deleted = 2
}

public enum UserStatus
{
    [Description("Pending")] Pending = 0,
    [Description("Active")] Active = 1,
    [Description("Locked")] Locked = 2,
    [Description("Deleted")] Deleted = 3
}

public enum OrderStatus
{
    PriceQuote = 0,
    Processing = 1,
    Shipping = 2,
    Completed = 3,
    Canceled = 4
}

public enum DiscountType
{
    [Description("Value")] Value = 0,
    [Description("Percent")] Percent = 1
}

public enum OrderMethod
{
    Construction = 0,
    Delivery = 1,
    ConstructionAndDelivery = 2
}

public enum FileStatus
{
    InActive = 0,
    Active = 1,
    Deleted = 2
}