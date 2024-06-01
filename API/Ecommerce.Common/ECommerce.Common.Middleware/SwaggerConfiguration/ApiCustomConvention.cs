using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace ECommerce.Common.Middleware.SwaggerConfiguration;

public static class CustomApiConvention
{
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ErrorResponse))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ErrorResponse))]
    [ApiConventionNameMatch(ApiConventionNameMatchBehavior.Any)]
    public static void ActionName([ApiConventionNameMatch(ApiConventionNameMatchBehavior.Any)] object dto)
    { }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ErrorResponse))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ErrorResponse))]
    [ApiConventionNameMatch(ApiConventionNameMatchBehavior.Any)]
    public static void ActionWithMultiplesQuery([ApiConventionNameMatch(ApiConventionNameMatchBehavior.Any)] params object[] query)
    { }
}