using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain.DTOs.User;
using ECommerce.Shop.Domain.IService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
public class UserController : AdminBaseController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService,
        ICurrentUser currentUser,
        IConfiguration configuration,
        ILogger<UserController> logger) : base(configuration, logger, currentUser)
    {
        _userService = userService;
    }
    
    [HttpGet]
    [Route("")]
    public async Task<IActionResult> GetUserListAsync([FromQuery] UserFilterParamsDto searchDto)
    {
        _logger.LogInformation("Start getting user list - GetUserListAsync");
        try
        {
            var result = await _userService.GetUserListAsync(searchDto);
            _logger.LogInformation("Start getting user list - GetUserListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetUserListAsync)} failed: ");
            return BadRequest();
        }
    }
}