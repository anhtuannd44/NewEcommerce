using ECommerce.IdentityServer.Application.ConfigurationOptions;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.IdentityServer.Web.Controllers;

public class BaseController : ControllerBase
{
    protected readonly AppSettingConfiguration _appSettings = new();
    protected readonly ILogger _logger;

    public BaseController(IConfiguration configuration,
        ILogger logger)
    {
        configuration.Bind(_appSettings);
        _logger = logger;
    }
}