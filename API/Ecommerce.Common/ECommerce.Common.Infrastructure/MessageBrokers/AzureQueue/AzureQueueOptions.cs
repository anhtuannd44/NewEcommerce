namespace ECommerce.Common.Infrastructure.MessageBrokers.AzureQueue;

public class AzureQueueOptions
{
    public string ConnectionString { get; set; }

    public Dictionary<string, string> QueueNames { get; set; }
}
