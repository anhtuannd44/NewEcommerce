﻿using System.Collections.Generic;

namespace ECommerce.Infrastructure.Logging;

public class LoggingOptions
{
    public Dictionary<string, string> LogLevel { get; set; }

    public FileOptions File { get; set; }

    public EventLogOptions EventLog { get; set; }

    public ApplicationInsightsOptions ApplicationInsights { get; set; }
}
