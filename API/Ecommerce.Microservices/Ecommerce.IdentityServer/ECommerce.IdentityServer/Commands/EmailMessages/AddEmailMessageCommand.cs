﻿using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Infrastructure.Grpc;
using ECommerce.IdentityServer.DTOs;
using Grpc.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using static ECommerce.Notification.Grpc.Email;

namespace ECommerce.IdentityServer.Commands.EmailMessages;

public class AddEmailMessageCommand : ICommand
{
    public EmailMessageDTO EmailMessage { get; set; }
}

public class AddEmailMessageCommandHandler : ICommandHandler<AddEmailMessageCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AddEmailMessageCommandHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task HandleAsync(AddEmailMessageCommand command, CancellationToken cancellationToken = default)
    {
        if (_httpContextAccessor.HttpContext != null)
        {
            var token = await _httpContextAccessor.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
            var headers = new Metadata
            {
                { "Authorization", $"Bearer {token}" },
            };

            var client = new EmailClient(ChannelFactory.Create(_configuration["Services:Notification:Grpc"]));

            client.AddEmailMessage(new Notification.Grpc.AddEmailMessageRequest
            {
                Message = new Notification.Grpc.EmailMessage
                {
                    From = command.EmailMessage.From,
                    Tos = command.EmailMessage.Tos,
                    CCs = command.EmailMessage.CCs ?? string.Empty,
                    BCCs = command.EmailMessage.BCCs ?? string.Empty,
                    Subject = command.EmailMessage.Subject,
                    Body = command.EmailMessage.Body,
                },
            }, headers, cancellationToken: cancellationToken);
        }
    }
}