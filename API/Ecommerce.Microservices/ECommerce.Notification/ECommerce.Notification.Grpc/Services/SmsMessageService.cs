using ECommerce.Common.Application.Common;
using ECommerce.Common.Application.Common.Commands;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using static ECommerce.Notification.Grpc.Sms;

namespace ECommerce.Notification.Grpc.Services;

[Authorize]
public class SmsMessageService : SmsBase
{
    private readonly ILogger<SmsMessageService> _logger;
    private readonly Dispatcher _dispatcher;

    public SmsMessageService(ILogger<SmsMessageService> logger, Dispatcher dispatcher)
    {
        _logger = logger;
        _dispatcher = dispatcher;
    }

    [AllowAnonymous]
    public override async Task<AddSmsMessageResponse> AddSmsMessage(AddSmsMessageRequest request, ServerCallContext context)
    {
        var message = new Entities.SmsMessage
        {
            Message = request.Message.Message,
            PhoneNumber = request.Message.PhoneNumber,
        };

        await _dispatcher.DispatchAsync(new AddOrUpdateEntityCommand<Entities.SmsMessage>(message));

        var response = new AddSmsMessageResponse
        {
            Message = request.Message
        };

        response.Message.Id = message.Id.ToString();

        return response;
    }
}
