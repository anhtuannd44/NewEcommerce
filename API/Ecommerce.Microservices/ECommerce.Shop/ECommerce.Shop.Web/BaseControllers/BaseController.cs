using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Application.ConfigurationOptions;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.BaseControllers;

[ApiController]
public class BaseController : ControllerBase
{
    protected readonly AppSettingConfiguration _appSettings = new();
    protected readonly ILogger _logger;
    protected readonly ICurrentUser _currentUser;

    public BaseController(IConfiguration configuration,
        ILogger logger,
        ICurrentUser currentUser)
    {
        configuration.Bind(_appSettings);
        _logger = logger;
        _currentUser = currentUser;
    }
}