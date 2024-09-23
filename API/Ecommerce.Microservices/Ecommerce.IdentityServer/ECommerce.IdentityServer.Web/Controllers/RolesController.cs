using ECommerce.Common.Application.Common;
using ECommerce.IdentityServer.Authorization;
using ECommerce.IdentityServer.Commands.Roles;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Queries;
using ECommerce.IdentityServer.Web.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.IdentityServer.Web.Controllers;

[Authorize]
[Produces("application/json")]
[Route("api/[controller]")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly Dispatcher _dispatcher;

    public RolesController(Dispatcher dispatcher, ILogger<RolesController> logger)
    {
        _dispatcher = dispatcher;
    }

    [Authorize(AuthorizationPolicyNames.GetRolesPolicy)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> Get()
    {
        var roles = await _dispatcher.DispatchAsync(new GetRolesQuery { AsNoTracking = true });
        var dto = roles.ToModels();
        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.GetRolePolicy)]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Role>> Get(Guid id)
    {
        var role = await _dispatcher.DispatchAsync(new GetRoleQuery { Id = id, AsNoTracking = true });
        var dto = role.ToDto();
        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.AddRolePolicy)]
    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Role>> Post([FromBody] RoleDto dto)
    {
        var role = new Role
        {
            Name = dto.Name,
            NormalizedName = dto.Name.ToUpper(),
        };

        await _dispatcher.DispatchAsync(new AddUpdateRoleCommand { Role = role });

        dto = role.ToDto();

        return Created($"/api/roles/{dto.Id}", dto);
    }

    [Authorize(AuthorizationPolicyNames.UpdateRolePolicy)]
    [HttpPut("{id}")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Put(Guid id, [FromBody] RoleDto dto)
    {
        var role = await _dispatcher.DispatchAsync(new GetRoleQuery { Id = id });

        role.Name = dto.Name;
        role.NormalizedName = dto.Name.ToUpper();

        await _dispatcher.DispatchAsync(new AddUpdateRoleCommand { Role = role });

        dto = role.ToDto();

        return Ok(dto);
    }

    [Authorize(AuthorizationPolicyNames.DeleteRolePolicy)]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var role = await _dispatcher.DispatchAsync(new GetRoleQuery { Id = id });
        await _dispatcher.DispatchAsync(new DeleteRoleCommand { Role = role });

        return Ok();
    }
}