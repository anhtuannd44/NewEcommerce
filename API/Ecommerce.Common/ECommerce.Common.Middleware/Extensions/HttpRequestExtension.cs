using System.Text;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Common.Middleware.Extensions;

public static class HttpRequestExtension
{
    public static bool TryGetBasicCredentials(this HttpRequest httpRequest, out string userName, out string password)
    {
        string authorization = httpRequest.Headers["Authorization"];

        if (!string.IsNullOrWhiteSpace(authorization) && authorization.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                var data = Convert.FromBase64String(authorization["Basic ".Length..].Trim());
                var text = Encoding.UTF8.GetString(data);
                var delimiterIndex = text.IndexOf(':');
                if (delimiterIndex >= 0)
                {
                    userName = text[..delimiterIndex];
                    password = text[(delimiterIndex + 1)..];
                    return true;
                }
            }
            catch (FormatException)
            {
            }
            catch (ArgumentException)
            {
            }
        }

        userName = null;
        password = null;
        return false;
    }
}