namespace ECommerce.Common.CrossCuttingConcerns.HtmlGenerator;

public interface IHtmlGenerator
{
    Task<string> GenerateAsync(string template, object model);
}
