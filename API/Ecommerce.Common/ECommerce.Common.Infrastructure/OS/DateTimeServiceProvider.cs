using ECommerce.Common.CrossCuttingConcerns.OS;

namespace ECommerce.Common.Infrastructure.OS;

public class DateTimeServiceProvider : IDateTimeServiceProvider
{
    public DateTime Now => DateTime.Now;

    public DateTime UtcNow => DateTime.UtcNow;
}