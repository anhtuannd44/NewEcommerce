﻿using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace ECommerce.Store.Api.RateLimiterPolicies;

public class DefaultRateLimiterPolicy : IRateLimiterPolicy<string>
{
    public Func<OnRejectedContext, CancellationToken, ValueTask> OnRejected { get; } = (context, _) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        return default;
    };

    public RateLimitPartition<string> GetPartition(HttpContext httpContext)
    {
        // same policy name and same partition key => will use the same rate limiter instance
        string partitionKey;

        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            partitionKey = httpContext.User.Identity.Name!;
            return RateLimitPartition.GetFixedWindowLimiter(partitionKey,
                _ => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 200,
                    Window = TimeSpan.FromMinutes(1),
                });
        }

        partitionKey = httpContext.Request.Headers.Host.ToString();
        return RateLimitPartition.GetFixedWindowLimiter(partitionKey,
            _ => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
            });
    }
}
