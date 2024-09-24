using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(ECommerce.IdentityServer.Areas.Identity.IdentityHostingStartup))]
namespace ECommerce.IdentityServer.Areas.Identity;

public class IdentityHostingStartup : IHostingStartup
{
    public void Configure(IWebHostBuilder builder)
    {
    }
}