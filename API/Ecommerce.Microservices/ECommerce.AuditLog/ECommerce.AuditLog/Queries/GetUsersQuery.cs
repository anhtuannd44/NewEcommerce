using ECommerce.AuditLog.DTOs;
using ECommerce.Common.Application.Common.Queries;
using ECommerce.Common.Infrastructure.Grpc;
using ECommerce.Identity.Grpc;
using Grpc.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using User = ECommerce.Identity.Grpc.User;

namespace ECommerce.AuditLog.Queries;

public class GetUsersQuery : IQuery<List<UserDTO>>
{
    public bool IncludeClaims { get; set; }
    public bool IncludeUserRoles { get; set; }
    public bool IncludeRoles { get; set; }
    public bool AsNoTracking { get; set; }
}

public class GetUsersQueryHandler : IQueryHandler<GetUsersQuery, List<UserDTO>>
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetUsersQueryHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<UserDTO>> HandleAsync(GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        var token = await _httpContextAccessor.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
        var headers = new Metadata
        {
            { "Authorization", $"Bearer {token}" },
        };

        var client = new User.UserClient(ChannelFactory.Create(_configuration["Services:Identity:Grpc"]));
        var response = await client.GetUsersAsync(new GetUsersRequest(), headers);

        return response.Users.Select(x => new UserDTO
        {
            Id = Guid.Parse(x.Id),
            UserName = x.UserName,
            Email = x.Email,
        }).ToList();
    }
}
