﻿namespace ECommerce.Common.Application.Decorators.AuditLog;

[AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = true)]
public sealed class AuditLogAttribute : Attribute
{
}
