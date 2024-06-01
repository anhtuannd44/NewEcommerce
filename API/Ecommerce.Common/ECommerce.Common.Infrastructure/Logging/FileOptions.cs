using Serilog.Events;

namespace ECommerce.Common.Infrastructure.Logging;

public class FileOptions
{
    public LogEventLevel MinimumLogEventLevel { get; set; }
}