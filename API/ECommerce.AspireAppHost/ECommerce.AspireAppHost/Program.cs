var builder = DistributedApplication.CreateBuilder(args);

var identityApi = builder.AddProject<Projects.ECommerce_IdentityServer_Web>("ECommerce-IdentityServer-Web");

var apiGateway = builder.AddProject<Projects.ECommerce_Gateways_WebAPI>("ECommerce-Gateways-WebAPI");


var identityServer = builder
    .AddExecutable("ECommerce-IdentityServer", "dotnet", "../../ECommerce.IdentityServer/ECommerce.IdentityServer", "run", $"--urls=https://localhost:44367");

builder.Build().Run();