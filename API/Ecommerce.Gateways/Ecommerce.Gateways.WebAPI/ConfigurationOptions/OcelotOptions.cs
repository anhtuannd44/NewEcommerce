namespace Ecommerce.Gateways.WebAPI.ConfigurationOptions;

public class OcelotOptions
{
    public string DefaultDownstreamScheme { get; set; }

    public Dictionary<string, OcelotRouteOptions> Routes { get; set; }
}

public class OcelotRouteOptions
{
    public List<string> UpstreamPathTemplates { get; set; }

    public string Downstream { get; set; }
}
