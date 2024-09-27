using ECommerce.Common.Domain.Infrastructure.MessageBrokers;
using ECommerce.Storage.Api.Entities;

namespace ECommerce.Storage.Api.DTOs;

public class FileUploadedEvent : IMessageBusEvent
{
    public FileEntry FileEntry { get; set; }
}
