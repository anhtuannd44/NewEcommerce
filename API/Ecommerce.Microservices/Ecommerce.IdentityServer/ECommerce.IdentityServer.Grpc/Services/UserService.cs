using ECommerce.Common.Application.Common;
using ECommerce.Identity.Grpc;
using ECommerce.IdentityServer.Queries;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;

namespace ECommerce.IdentityServer.Grpc.Services;

[Authorize]
public class UserService : User.UserBase
{
    private readonly ILogger<UserService> _logger;
    private readonly Dispatcher _dispatcher;

    public UserService(ILogger<UserService> logger, Dispatcher dispatcher)
    {
        _logger = logger;
        _dispatcher = dispatcher;
    }

    public override async Task<GetUsersResponse> GetUsers(GetUsersRequest request, ServerCallContext context)
    {
        var users = (await _dispatcher.DispatchAsync(new GetUsersQuery())).Select(x => new UserMessage
        {
            Id = x.Id.ToString(),
            UserName = x.UserName,
            Email = x.Email,
        });

        var rp = new GetUsersResponse();
        rp.Users.AddRange(users);
        return rp;
    }

    public override async Task<GetUserResponse> GetUser(GetUserRequest request, ServerCallContext context)
    {
        var user = await _dispatcher.DispatchAsync(new GetUserQuery { Id = Guid.Parse(request.Id), AsNoTracking = true });

        var response = new GetUserResponse
        {
            User = user != null ? new UserMessage
            {
                Id = user.Id.ToString(),
                UserName = user.UserName,
                Email = user.Email,
            } : null
        };

        return response;
    }
}
