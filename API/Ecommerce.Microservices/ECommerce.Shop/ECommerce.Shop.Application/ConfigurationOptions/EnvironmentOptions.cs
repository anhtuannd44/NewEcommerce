namespace ECommerce.Shop.Application.ConfigurationOptions;

public class EnvironmentOptions
{
    public string Name { get; set; }
    public InstanceOptions Instance { get; set; }
}

public class InstanceOptions
{
    public string Name { get; set; }
}