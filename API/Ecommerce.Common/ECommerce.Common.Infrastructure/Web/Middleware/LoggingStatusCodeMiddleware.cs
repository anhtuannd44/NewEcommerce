using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ECommerce.Common.Infrastructure.Web.Middleware;

public class LoggingStatusCodeMiddleware(RequestDelegate next, ILogger<LoggingStatusCodeMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (string.IsNullOrEmpty(context.Request.Headers.Authorization))
        {
            var token = context.Request.Cookies["authToken"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Request.Headers.Authorization = token.Contains("Bearer", StringComparison.OrdinalIgnoreCase) ? token : $"Bearer {token}";
            }
        }

        await next(context);

        var statusCode = context.Response.StatusCode;
        var path = context.Request.Path;
        var method = context.Request.Method;
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? context.User.FindFirst("sub")?.Value;
        var userName = (context.User.FindFirst(ClaimTypes.Email) ?? context.User.FindFirst("email"))?.Value;
        var remoteIp = context.Connection.RemoteIpAddress;

        var statusCodes = new[] { StatusCodes.Status401Unauthorized, StatusCodes.Status403Forbidden };

        if (statusCodes.Contains(statusCode))
        {
            logger.LogWarning($"StatusCode: {statusCode}, UserId: {userId}, UserName: {userName}, Path: {path}, Method: {method}, IP: {remoteIp}");
        }
    }
}