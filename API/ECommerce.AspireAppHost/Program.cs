var builder = DistributedApplication.CreateBuilder(args);

var apiGateway = builder.AddProject<Projects.Ecommerce_Gateways_WebAPI>("Ecommerce-Gateways-WebAPI");

var identityApi = builder.AddProject<Projects.ECommerce_IdentityServer_Web>("ECommerce-IdentityServer-Web");

var auditLogApi = builder.AddProject<Projects.ECommerce_AuditLog_Api>("ECommerce-AuditLog-Api");

var notificationApi = builder.AddProject<Projects.ECommerce_Notification_Api>("ECommerce-Notification-Api");

var configurationApi = builder.AddProject<Projects.ECommerce_Configuration_Api>("ECommerce-Configuration-Api");

var storageApi = builder.AddProject<Projects.ECommerce_Storage_Api>("ECommerce-Storage-Api");

var identityServer = builder
    .AddExecutable("IdentityServer", "dotnet", "../../IdentityServer/OpenIddict/ECommerce.IdentityServer", "run", $"--urls=https://localhost:44367");


builder.Build().Run();