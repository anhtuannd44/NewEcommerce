﻿using System.Reflection;
using ECommerce.Common.Application.Common.Commands;
using ECommerce.Common.Application.Common.Queries;
using ECommerce.Common.CrossCuttingConcerns.ExtensionMethods;

namespace ECommerce.Common.Application.Decorators;

internal static class Mappings
{
    static Mappings()
    {
        var decorators = Assembly.GetExecutingAssembly().GetTypes();
        foreach (var type in decorators)
        {
            if (type.HasInterface(typeof(ICommandHandler<>)))
            {
                var decoratorAttribute = (MappingAttribute)type.GetCustomAttributes(false).FirstOrDefault(x => x is MappingAttribute);

                if (decoratorAttribute != null)
                {
                    AttributeToCommandHandler[decoratorAttribute.Type] = type;
                }
            }
            else if (type.HasInterface(typeof(IQueryHandler<,>)))
            {
                var decoratorAttribute = (MappingAttribute)type.GetCustomAttributes(false).FirstOrDefault(x => x is MappingAttribute);

                if (decoratorAttribute != null)
                {
                    AttributeToQueryHandler[decoratorAttribute.Type] = type;
                }
            }
        }
    }

    public static readonly Dictionary<Type, Type> AttributeToCommandHandler = new();

    public static readonly Dictionary<Type, Type> AttributeToQueryHandler = new();
}

[AttributeUsage(AttributeTargets.Class)]
public sealed class MappingAttribute : Attribute
{
    public Type Type { get; set; }
}