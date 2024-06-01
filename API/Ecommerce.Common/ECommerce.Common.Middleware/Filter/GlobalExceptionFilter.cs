using System.ComponentModel.DataAnnotations;
using System.Net;
using ECommerce.Common.Domain.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using static System.Threading.Thread;

namespace ECommerce.Common.Middleware.Filter;

public class GlobalExceptionFilter : IExceptionFilter
{
    private static ILogger _logger;
    private static string _showLogLevel;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger, IConfiguration configuration)
    {
        _logger = logger;
        _showLogLevel = configuration["Tracing:ShowLogLevel"];
    }

    private static string GetErrorMessage(Exception ex)
    {
        if (ex is ValidationException)
        {
            return ex.Message;
        }

        var showLogLevel = Enum.Parse<ShowLogLevel>(_showLogLevel);
        string output;
        switch (showLogLevel)
        {
            case ShowLogLevel.Production:
                output = "An internal exception occurred. We'll take care of it.";
                break;

            case ShowLogLevel.Stacktrace:
                output = ex.StackTrace;
                break;

            case ShowLogLevel.Default:
            default:
                output = ex.Message;
                break;
        }

        return output;
    }

    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ValidationException)
        {
            context.Result = new BadRequestObjectResult(new { Message = GetErrorMessage(context.Exception) });
            return;
        }
        
        _logger.LogError(context.Exception, "[{0}-{1}]", DateTime.UtcNow.Ticks, CurrentThread.ManagedThreadId);

        context.Result = new ObjectResult(new { Message = GetErrorMessage(context.Exception) })
        {
            StatusCode = (int)HttpStatusCode.InternalServerError
        };
    }
}