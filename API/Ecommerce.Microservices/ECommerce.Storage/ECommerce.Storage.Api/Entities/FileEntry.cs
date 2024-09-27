using ECommerce.Common.Domain.Entities.BaseEntity;

namespace ECommerce.Storage.Api.Entities;

public class FileEntry : BaseEntity<Guid>, IAggregateRoot
{
    public string Name { get; set; }

    public string Description { get; set; }

    public long Size { get; set; }

    public DateTimeOffset UploadedTime { get; set; }

    public string FileName { get; set; }

    public string FileLocation { get; set; }

    public bool Encrypted { get; set; }

    public string EncryptionKey { get; set; }

    public string EncryptionIV { get; set; }
}
