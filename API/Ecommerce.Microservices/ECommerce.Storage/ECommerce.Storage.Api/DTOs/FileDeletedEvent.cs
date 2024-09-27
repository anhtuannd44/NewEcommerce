using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Storage.Api.Entities;

namespace ECommerce.Storage.Api.DTOs;

public class FileDeletedEvent : IMessageBusEvent
{
    public FileEntry FileEntry { get; set; }
}
