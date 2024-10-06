using ECommerce.Common.Application;
using ECommerce.Common.Infrastructure.DateTimes;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Notification;
using ECommerce.Notification.Background.HostedServices;
using ECommerce.Notification.Background.Identity;
using ECommerce.Notification.ConfigurationOptions;

var builder = Host.CreateDefaultBuilder(args);

var appSettings = new AppSettings();

builder.UseWindowsService();

builder.UseECommerceLogger(configuration =>
{
    configuration.Bind(appSettings);
    return appSettings.Logging;
});

builder.ConfigureServices((_, services) =>
{
    var serviceProvider = services.BuildServiceProvider();
    var configuration = serviceProvider.GetService<IConfiguration>();

    configuration.Bind(appSettings);

    services.AddDateTimeProvider();
    services.AddApplicationServices();
    services.AddNotificationModule(appSettings);

    services.AddScoped<ICurrentUser, CurrentUser>();
    services.AddHostedService<SendEmailWorker>();
    services.AddHostedService<SendSmsWorker>();
});

builder.Build().Run();