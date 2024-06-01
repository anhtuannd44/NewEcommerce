using Microsoft.AspNetCore.Builder;

namespace ECommerce.Common.Infrastructure.Web.Middleware;

public static class IApplicationBuilderExtensions
{
    public static IApplicationBuilder UseLoggingStatusCodeMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<LoggingStatusCodeMiddleware>();
        return app;
    }
}