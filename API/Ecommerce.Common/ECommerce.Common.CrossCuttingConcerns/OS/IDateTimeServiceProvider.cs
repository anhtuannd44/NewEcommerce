using System;

namespace ECommerce.Common.CrossCuttingConcerns.OS;

public interface IDateTimeServiceProvider
{
    DateTime Now { get; }

    DateTime UtcNow { get; }
}