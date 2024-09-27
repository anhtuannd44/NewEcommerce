using System.Reflection;
using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Application.Common.Queries;
using ECommerce.Common.Domain.Events;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Common.Application.Common;

public class Dispatcher
{
    private readonly IServiceProvider _provider;

    private static List<Type> _eventHandlers = [];

    public static void RegisterEventHandlers(Assembly assembly, IServiceCollection services)
    {
        var types = assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(y => y.IsGenericType && y.GetGenericTypeDefinition() == typeof(IDomainEventHandler<>)))
            .ToList();

        foreach (var type in types)
        {
            services.AddTransient(type);
        }

        _eventHandlers.AddRange(types);
    }

    public Dispatcher(IServiceProvider provider)
    {
        _provider = provider;
    }

    public async Task DispatchAsync(ICommand command, CancellationToken cancellationToken = default)
    {
        var type = typeof(ICommandHandler<>);
        Type[] typeArgs = [command.GetType()];
        var handlerType = type.MakeGenericType(typeArgs);

        dynamic handler = _provider.GetService(handlerType);
        
        if (handler == null)
        {
            return;
        }
        
        await handler.HandleAsync((dynamic)command, cancellationToken);
    }

    public async Task<T> DispatchAsync<T>(IQuery<T> query, CancellationToken cancellationToken = default)
    {
        var type = typeof(IQueryHandler<,>);
        Type[] typeArgs = [query.GetType(), typeof(T)];
        var handlerType = type.MakeGenericType(typeArgs);

        dynamic handler = _provider.GetService(handlerType);
        Task<T> result = handler.HandleAsync((dynamic)query, cancellationToken);

        return await result;
    }

    public async Task DispatchAsync(IDomainEvent domainEvent, CancellationToken cancellationToken = default)
    {
        foreach (var handler in from handlerType in _eventHandlers let canHandleEvent = handlerType.GetInterfaces()
                     .Any(x => x.IsGenericType
                               && x.GetGenericTypeDefinition() == typeof(IDomainEventHandler<>)
                               && x.GenericTypeArguments[0] == domainEvent.GetType()) where canHandleEvent select _provider.GetService(handlerType))
        {
            await ((dynamic)handler).HandleAsync((dynamic)domainEvent, cancellationToken);
        }
    }
}