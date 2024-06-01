namespace ECommerce.Common.CrossCuttingConcerns.Extensions;

public static class GuidExtension
{
    public static bool IsNullOrEmpty(this Guid? guid)
    {
        return guid == null || guid == Guid.Empty;
    }

    public static bool IsEmpty(this Guid guid)
    {
        return guid == Guid.Empty;
    }
}