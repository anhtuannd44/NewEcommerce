namespace ECommerce.Shop.Domain;

public static class ShopDomainConstants
{
    //Area Constant
    public const string AdminAreaName = "Admin";
    
    // Success Messages
    public const string MessageSuccessEntityCreated = "The entity has been created";
    public const string MessageSuccessEntityCreatedVi = "Thành công, liệu đã được tạo.";
    
    //Error Message
    public const string MessageErrorEntityNotFound = "The entity not found";
    public const string MessageErrorEntityNotFoundVi = "Không tìm thấy dữ liệu.";

    public const string MessageErrorInvalidRequest = "The request is invalid";
    public const string MessageErrorInvalidRequestVi = "Dữ liệu truyền lên chưa hợp lệ";
    
    public const string MessageErrorRequired = "Field required: {0}";
    public const string MessageErrorRequiredVi = "Không được để trống: {0}.";
    
    public const string MessageErrorExistedName = "Name existed: {0}";
    public const string MessageErrorExistedNameVi = "Tên đã tồn tại: {0}.";
    
    public const string MessageErrorSlug = "Invalid/Existed Slug";
    public const string MessageErrorSlugVi = "Đường dẫn không hợp lệ hoặc đã tồn tại.";

    public const string MessageErrorProductAttributeInvalid = "Invalid Product Attribute Combination - SKU: {0}";
    public const string MessageErrorProductAttributeInvalidVi = "Dữ liệu tạo chưa sản phẩm biến thể chưa hợp lệ. Vui lòng kiểm tra lại sản phẩm có mã: {0}";

    public const string MessageErrorSaveDb = "Error when saving data: ";
    public const string MessageErrorSaveDbVi = "Có lỗi khi cập nhật dữ liệu.";

    public const string MessageErrorCannotGetEntityVi = "Không tìm thấy dữ liệu.";
    
    //Message Information
    public const string MessageInformationStart = "Start - {0} - {1}";
    public const string MessageInformationEnd = "End - {0} - {1}";

    public const string MessageGetEntitySuccess = "Get entity(s) successfully - {0}";
}