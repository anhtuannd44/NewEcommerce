using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Application.Common.Queries;

namespace ECommerce.Common.Application.Common;

internal static class Utils
{
    public static bool IsHandlerInterface(Type type)
    {
        if (!type.IsGenericType)
        {
            return false;
        }

        var typeDefinition = type.GetGenericTypeDefinition();

        return typeDefinition == typeof(ICommandHandler<>)
            || typeDefinition == typeof(IQueryHandler<,>);
    }
}