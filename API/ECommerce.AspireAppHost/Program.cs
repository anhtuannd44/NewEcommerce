var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Ecommerce_Gateways_WebAPI>("Ecommerce-Gateways-WebAPI");

builder.AddProject<Projects.ECommerce_IdentityServer_Web>("ECommerce-IdentityServer-Web");
builder.AddProject<Projects.ECommerce_IdentityServer_Grpc>("ECommerce-IdentityServer-Grpc");

builder.AddProject<Projects.ECommerce_AuditLog_Api>("ECommerce-AuditLog-Api");
builder.AddProject<Projects.ECommerce_AuditLog_Grpc>("ECommerce-AuditLog-Grpc");

builder.AddProject<Projects.ECommerce_Notification_Api>("ECommerce-Notification-Api");
builder.AddProject<Projects.ECommerce_Notification_Grpc>("ECommerce-Notification-Grpc");

builder.AddProject<Projects.ECommerce_Configuration_Api>("ECommerce-Configuration-Api");

builder.AddProject<Projects.ECommerce_Store_Api>("ECommerce-Store-Api");

builder.AddProject<Projects.ECommerce_Storage_Api>("ECommerce-Storage-Api");

builder.AddExecutable("IdentityServer", "dotnet", "../../IdentityServer/OpenIddict/ECommerce.IdentityServer", "run", $"--urls=https://localhost:44367");


builder.Build().Run();