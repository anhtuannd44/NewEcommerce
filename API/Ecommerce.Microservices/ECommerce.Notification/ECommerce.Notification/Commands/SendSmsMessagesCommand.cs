﻿using ECommerce.Notification.Repositories;
using Microsoft.Extensions.Logging;
using System.Globalization;
using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.CrossCuttingConcerns.DateTimes;
using ECommerce.Common.Infrastructure.Notification.Sms;

namespace ECommerce.Notification.Commands;

public class SendSmsMessagesCommand : ICommand
{
    public int SentMessagesCount { get; set; }
}

public class SendSmsMessagesCommandHandler : ICommandHandler<SendSmsMessagesCommand>
{
    private readonly ILogger _logger;
    private readonly ISmsMessageRepository _repository;
    private readonly ISmsNotification _smsNotification;
    private readonly IDateTimeProvider _dateTimeProvider;

    public SendSmsMessagesCommandHandler(ILogger<SendSmsMessagesCommandHandler> logger,
        ISmsMessageRepository repository,
        ISmsNotification smsNotification,
        IDateTimeProvider dateTimeProvider)
    {
        _logger = logger;
        _repository = repository;
        _smsNotification = smsNotification;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task HandleAsync(SendSmsMessagesCommand command, CancellationToken cancellationToken = default)
    {
        var delayedTimes = new[]
        {
            TimeSpan.FromMinutes(1),
            TimeSpan.FromMinutes(2),
            TimeSpan.FromMinutes(3),
            TimeSpan.FromMinutes(5),
            TimeSpan.FromMinutes(8),
            TimeSpan.FromMinutes(13),
            TimeSpan.FromMinutes(21),
            TimeSpan.FromMinutes(34),
            TimeSpan.FromMinutes(55),
            TimeSpan.FromMinutes(89),
        };

        var dateTime = _dateTimeProvider.OffsetNow;
        var defaultAttemptCount = 5;

        var messages = _repository.GetQueryableSet()
            .Where(x => x.SentDateTime == null)
            .Where(x => x.ExpiredDateTime == null || x.ExpiredDateTime > dateTime)
            .Where(x => (x.MaxAttemptCount == 0 && x.AttemptCount < defaultAttemptCount) || x.AttemptCount < x.MaxAttemptCount)
            .Where(x => x.NextAttemptDateTime == null || x.NextAttemptDateTime <= dateTime)
            .ToList();

        if (messages.Any())
        {
            foreach (var sms in messages)
            {
                string log = Environment.NewLine + Environment.NewLine
                        + $"[{_dateTimeProvider.OffsetNow.ToString(CultureInfo.InvariantCulture)}] ";
                try
                {
                    await _smsNotification.SendAsync(new DTOs.SmsMessageDTO
                    {
                        Message = sms.Message,
                        PhoneNumber = sms.PhoneNumber,
                    }, cancellationToken);

                    sms.SentDateTime = _dateTimeProvider.OffsetNow;
                    sms.Log += log + "Succeed.";
                }
                catch (Exception ex)
                {
                    sms.Log += log + ex;
                    sms.NextAttemptDateTime = _dateTimeProvider.OffsetNow + delayedTimes[sms.AttemptCount];
                }

                sms.AttemptCount += 1;
                sms.Log = sms.Log.Trim();
                sms.UpdatedDateTime = _dateTimeProvider.OffsetNow;

                if (sms.MaxAttemptCount == 0)
                {
                    sms.MaxAttemptCount = defaultAttemptCount;
                }

                await _repository.UnitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
        else
        {
            _logger.LogInformation("No SMS to send.");
        }

        command.SentMessagesCount = messages.Count;
    }
}
