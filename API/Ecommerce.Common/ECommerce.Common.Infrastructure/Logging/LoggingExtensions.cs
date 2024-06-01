using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using System.Reflection;

namespace ECommerce.Common.Infrastructure.Logging
{
    public static class LoggingExtensions
    {
        private static void UseEcommerceLogger(this IWebHostEnvironment env, LoggingOptions options)
        {
            var assemblyName = Assembly.GetEntryAssembly()?.GetName().Name;

            var logsPath = Path.Combine(env.ContentRootPath, "logs");
            Directory.CreateDirectory(logsPath);
            var loggerConfiguration = new LoggerConfiguration();

            loggerConfiguration = loggerConfiguration
                .MinimumLevel.Debug()
                .Enrich.FromLogContext()
                .Enrich.With<ActivityEnricher>()
                .Enrich.WithMachineName()
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithProperty("Assembly", assemblyName)
                .Enrich.WithProperty("Application", env.ApplicationName)
                .Enrich.WithProperty("EnvironmentName", env.EnvironmentName)
                .Enrich.WithProperty("ContentRootPath", env.ContentRootPath)
                .Enrich.WithProperty("WebRootPath", env.WebRootPath)
                .Enrich.WithExceptionDetails()
                .Filter.ByIncludingOnly((logEvent) =>
                {
                    if (logEvent.Level < options.File.MinimumLogEventLevel
                        && logEvent.Level < options.Elasticsearch.MinimumLogEventLevel)
                    {
                        return false;
                    }
                    var sourceContext = logEvent.Properties.ContainsKey("SourceContext")
                        ? logEvent.Properties["SourceContext"].ToString()
                        : null;

                    var logLevel = GetLogLevel(sourceContext, options);

                    return logEvent.Level >= logLevel;

                })
                .WriteTo.Console()
                .WriteTo.File(Path.Combine(logsPath, "log.txt"),
                    fileSizeLimitBytes: 10 * 1024 * 1024,
                    rollOnFileSizeLimit: true,
                    shared: true,
                    flushToDiskInterval: TimeSpan.FromSeconds(1),
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext}] [TraceId: {TraceId}] {Message:lj}{NewLine}{Exception}",
                    restrictedToMinimumLevel: options.File.MinimumLogEventLevel);

            if (options.Elasticsearch is { IsEnabled: true })
            {
                loggerConfiguration = loggerConfiguration
                    .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(options.Elasticsearch.Host))
                    {
                        MinimumLogEventLevel = options.Elasticsearch.MinimumLogEventLevel,
                        AutoRegisterTemplate = true,
                        AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv6,
                        IndexFormat = options.Elasticsearch.IndexFormat + "-{0:yyyy.MM.dd}",
                        InlineFields = true,
                        EmitEventFailure = EmitEventFailureHandling.WriteToFailureSink
                    })
                    .WriteTo.File(Path.Combine(logsPath, "elasticsearch-failures.txt"), rollingInterval: RollingInterval.Day);
            }

            Log.Logger = loggerConfiguration.CreateLogger();
        }

        private static void UseEcommerceLogger(this IHostEnvironment env, LoggingOptions options)
        {
            var assemblyName = Assembly.GetEntryAssembly()?.GetName().Name;

            var logsPath = Path.Combine(env.ContentRootPath, "logs");
            Directory.CreateDirectory(logsPath);
            var loggerConfiguration = new LoggerConfiguration();

            loggerConfiguration = loggerConfiguration
                .MinimumLevel.Debug()
                .Enrich.FromLogContext()
                .Enrich.With<ActivityEnricher>()
                .Enrich.WithMachineName()
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithProperty("Assembly", assemblyName)
                .Enrich.WithProperty("Application", env.ApplicationName)
                .Enrich.WithProperty("EnvironmentName", env.EnvironmentName)
                .Enrich.WithProperty("ContentRootPath", env.ContentRootPath)
                .Enrich.WithExceptionDetails()
                .Filter.ByIncludingOnly((logEvent) =>
                {
                    if (logEvent.Level >= options.File.MinimumLogEventLevel
                    || logEvent.Level >= options.Elasticsearch.MinimumLogEventLevel)
                    {
                        var sourceContext = logEvent.Properties.ContainsKey("SourceContext")
                             ? logEvent.Properties["SourceContext"].ToString()
                             : null;

                        var logLevel = GetLogLevel(sourceContext, options);

                        return logEvent.Level >= logLevel;
                    }

                    return false;
                })
                .WriteTo.File(Path.Combine(logsPath, "log.txt"),
                    fileSizeLimitBytes: 10 * 1024 * 1024,
                    rollOnFileSizeLimit: true,
                    shared: true,
                    flushToDiskInterval: TimeSpan.FromSeconds(1),
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext}] [TraceId: {TraceId}] {Message:lj}{NewLine}{Exception}",
                    restrictedToMinimumLevel: options.File.MinimumLogEventLevel);

            if (options.Elasticsearch != null && options.Elasticsearch.IsEnabled)
            {
                loggerConfiguration = loggerConfiguration
                    .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(options.Elasticsearch.Host))
                    {
                        MinimumLogEventLevel = options.Elasticsearch.MinimumLogEventLevel,
                        AutoRegisterTemplate = true,
                        AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv6,
                        IndexFormat = options.Elasticsearch.IndexFormat + "-{0:yyyy.MM.dd}",
                        InlineFields = true,
                        EmitEventFailure = EmitEventFailureHandling.WriteToFailureSink
                    }).WriteTo.File(Path.Combine(logsPath, "elasticsearch-failures.txt"), rollingInterval: RollingInterval.Day);
            }

            Log.Logger = loggerConfiguration.CreateLogger();
        }

        private static LoggingOptions SetDefault(LoggingOptions options)
        {
            options ??= new LoggingOptions();

            options.LogLevel ??= new Dictionary<string, string>();

            options.LogLevel.TryAdd("Default", "Warning");

            options.File ??= new FileOptions
            {
                MinimumLogEventLevel = Serilog.Events.LogEventLevel.Warning,
            };

            options.Elasticsearch ??= new ElasticsearchOptions
            {
                IsEnabled = false,
                MinimumLogEventLevel = Serilog.Events.LogEventLevel.Warning,
            };

            options.EventLog ??= new EventLogOptions
            {
                IsEnabled = false,
            };
            return options;
        }

        private static Serilog.Events.LogEventLevel GetLogLevel(string context, LoggingOptions options)
        {
            context = context.Replace("\"", string.Empty);
            var level = "Default";
            var matches = options.LogLevel.Keys.Where(k => context.StartsWith(k)).ToList();

            if (matches.Count > 0)
            {
                level = matches.Max();
            }

            return (Serilog.Events.LogEventLevel)Enum.Parse(typeof(Serilog.Events.LogEventLevel), options.LogLevel[level], true);
        }

        public static IWebHostBuilder UseEcommerceLogger(this IWebHostBuilder builder, Func<IConfiguration, LoggingOptions> logOptions)
        {
            builder.ConfigureLogging((context, logging) =>
            {
                logging.Configure(_ =>
                {
                    // options.ActivityTrackingOptions = ActivityTrackingOptions.SpanId |
                    // ActivityTrackingOptions.TraceId | ActivityTrackingOptions.ParentId;
                });

                logging.AddSerilog();

                var options = SetDefault(logOptions(context.Configuration));
#if WINDOWS
                if (options.EventLog is { IsEnabled: true })
                {
                    logging.AddEventLog(new EventLogSettings
                    {
                        LogName = options.EventLog.LogName,
                        SourceName = options.EventLog.SourceName,
                    });
                }
#endif
                context.HostingEnvironment.UseEcommerceLogger(options);
            });

            return builder;
        }

        public static IHostBuilder UseEcommerceLogger(this IHostBuilder builder, Func<IConfiguration, LoggingOptions> logOptions)
        {
            builder.ConfigureLogging((context, logging) =>
            {
                logging.Configure(_ =>
                {
                    // options.ActivityTrackingOptions = ActivityTrackingOptions.SpanId |
                    // ActivityTrackingOptions.TraceId | ActivityTrackingOptions.ParentId;
                });

                logging.AddSerilog();

                var options = SetDefault(logOptions(context.Configuration));
#if WINDOWS
                if (options.EventLog?.IsEnabled == true)
                {
                    logging.AddEventLog(new EventLogSettings
                    {
                        LogName = options.EventLog.LogName,
                        SourceName = options.EventLog.SourceName,
                    });
                }
#endif
                context.HostingEnvironment.UseEcommerceLogger(options);
            });

            return builder;
        }
    }
}