namespace ECommerce.Common.Middleware.SwaggerConfiguration;

public class SwaggerTagNameAttribute : Attribute
{
    public string DisplayName { get; set; }

    public SwaggerTagNameAttribute(string displayName)
    {
        DisplayName = displayName;
    }
}