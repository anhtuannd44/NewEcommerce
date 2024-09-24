using ECommerce.Common.Infrastructure.Storages.Amazon;
using ECommerce.Common.Infrastructure.Storages.Azure;
using ECommerce.Common.Infrastructure.Storages.Local;

namespace ECommerce.Common.Infrastructure.Storages;

public class StorageOptions
{
    public string Provider { get; set; }

    public string MasterEncryptionKey { get; set; }

    public LocalOptions Local { get; set; }

    public AzureBlobOption Azure { get; set; }

    public AmazonOptions Amazon { get; set; }

    public bool UsedLocal()
    {
        return Provider == "Local";
    }

    public bool UsedAzure()
    {
        return Provider == "Azure";
    }

    public bool UsedAmazon()
    {
        return Provider == "Amazon";
    }

    public bool UsedFake()
    {
        return Provider == "Fake";
    }
}
