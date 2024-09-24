using ECommerce.Common.Application;
using ECommerce.Common.Infrastructure.DateTimes;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Common.Infrastructure.Logging;
using ECommerce.Notification;
using ECommerce.Notification.Background.HostedServices;
using ECommerce.Notification.Background.Identity;
using ECommerce.Notification.ConfigurationOptions;

CreateHostBuilder(args).Build().Run();

static IHostBuilder CreateHostBuilder(string[] args) =>
       Host.CreateDefaultBuilder(args)
       .UseWindowsService()
       .UseECommerceLogger(configuration =>
       {
           var appSettings = new AppSettings();
           configuration.Bind(appSettings);
           return appSettings.Logging;
       })
       .ConfigureServices((hostContext, services) =>
       {
           var serviceProvider = services.BuildServiceProvider();
           var configuration = serviceProvider.GetService<IConfiguration>();

           var appSettings = new AppSettings();
           configuration.Bind(appSettings);

           services.AddDateTimeProvider();
           services.AddApplicationServices();
           services.AddNotificationModule(appSettings);

           services.AddScoped<ICurrentUser, CurrentUser>();
           services.AddHostedService<SendEmailWorker>();
           services.AddHostedService<SendSmsWorker>();
       });
