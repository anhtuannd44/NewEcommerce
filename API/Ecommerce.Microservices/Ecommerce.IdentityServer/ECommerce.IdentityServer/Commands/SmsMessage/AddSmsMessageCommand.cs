using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Infrastructure.Grpc;
using ECommerce.IdentityServer.DTOs;
using Grpc.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using static ECommerce.Notification.Grpc.Sms;

namespace ECommerce.IdentityServer.Commands.SmsMessage;

public class AddSmsMessageCommand : ICommand
{
    public SmsMessageDTO SmsMessage { get; set; }
}

public class AddSmsMessageCommandHandler : ICommandHandler<AddSmsMessageCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AddSmsMessageCommandHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task HandleAsync(AddSmsMessageCommand command, CancellationToken cancellationToken = default)
    {
        if (_httpContextAccessor.HttpContext != null)
        {
            var token = await _httpContextAccessor.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
            var headers = new Metadata
            {
                { "Authorization", $"Bearer {token}" },
            };

            var client = new SmsClient(ChannelFactory.Create(_configuration["Services:Notification:Grpc"]));

            client.AddSmsMessage(new Notification.Grpc.AddSmsMessageRequest
            {
                Message = new Notification.Grpc.SmsMessage
                {
                    Message = command.SmsMessage.Message,
                    PhoneNumber = command.SmsMessage.PhoneNumber,
                },
            }, headers, cancellationToken: cancellationToken);
        }
    }
}