using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain;
using ECommerce.Shop.Web.BaseControllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Authorize]
[Area(ShopDomainConstants.AdminAreaName)]
public class AdminBaseController : BaseController
{

    public AdminBaseController(IConfiguration configuration,
        ILogger logger,
        ICurrentUser currentUser) : base(configuration, logger, currentUser)
    {
    }
}