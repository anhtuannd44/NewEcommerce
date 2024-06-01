namespace ECommerce.Common.Middleware.SwaggerConfiguration;

public class CustomSchemaStrategy
{
    private readonly string[] removedStrings;

    public CustomSchemaStrategy(params string[] removedStrings)
    {
        this.removedStrings = removedStrings;
    }

    public CustomSchemaStrategy()
    {
        removedStrings = new string[] { "Dto", "Sync" };
    }

    public string SwaggerSchemaId(Type currentClass)
    {
        var returnedValue = currentClass.Name;

        foreach (var removedString in removedStrings)
        {
            if (returnedValue.Contains("DeclarationDashboardDetailSync"))
            {
                returnedValue = returnedValue.Replace(removedString, string.Empty);
                returnedValue = returnedValue + "Sync";
            }
            else if (returnedValue.EndsWith(removedString))
            {
                returnedValue = returnedValue.Replace(removedString, string.Empty);
            }
        }
        return returnedValue;
    }
}