using ECommerce.Common.Infrastructure.Grpc;
using ECommerce.Identity.Grpc;
using ECommerce.Store.Api.DTOs;
using Grpc.Core;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace ECommerce.Store.Api.Queries;

public class GetUsersQuery : IRequest<List<UserDTO>>
{
    public bool IncludeClaims { get; set; }
    public bool IncludeUserRoles { get; set; }
    public bool IncludeRoles { get; set; }
    public bool AsNoTracking { get; set; }
}

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDTO>>
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetUsersQueryHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<UserDTO>> Handle(GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(_httpContextAccessor.HttpContext);
        
        var token = await _httpContextAccessor.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
        var headers = new Metadata
        {
            { "Authorization", $"Bearer {token}" },
        };

        var client = new User.UserClient(ChannelFactory.Create(_configuration["Services:Identity:Grpc"]));
        var response = await client.GetUsersAsync(new GetUsersRequest(), headers, null, cancellationToken);

        return response.Users.Select(x => new UserDTO
        {
            Id = Guid.Parse(x.Id),
            UserName = x.UserName,
            Email = x.Email,
        }).ToList();
    }
}
