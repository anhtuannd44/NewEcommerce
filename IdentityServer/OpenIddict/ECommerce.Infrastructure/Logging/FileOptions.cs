using Serilog.Events;

namespace ECommerce.Infrastructure.Logging;

public class FileOptions
{
    public LogEventLevel MinimumLogEventLevel { get; set; }
}
