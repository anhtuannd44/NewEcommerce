﻿using ECommerce.Common.Infrastructure.Storages;

namespace ECommerce.Storage.Api.Models;

public class FileEntryModel : IFileEntry
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public long Size { get; set; }

    public DateTimeOffset UploadedTime { get; set; }

    public string FileName { get; set; }

    public string FileLocation { get; set; }

    public bool Encrypted { get; set; }
}
