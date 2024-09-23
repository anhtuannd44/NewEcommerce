namespace ECommerce.Common.Domain.Entities.BaseEntity;

public class CustomMigrationHistory : BaseEntity<Guid>
{
    public string MigrationName { get; set; }
}