using System;

namespace ECommerce.Domain.Entities;

public class CustomMigrationHistory : Entity<Guid>
{
    public string MigrationName { get; set; }
}
