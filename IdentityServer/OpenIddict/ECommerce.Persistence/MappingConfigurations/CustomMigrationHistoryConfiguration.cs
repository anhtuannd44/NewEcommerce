﻿using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.MappingConfigurations;

public class CustomMigrationHistoryConfiguration : IEntityTypeConfiguration<CustomMigrationHistory>
{
    public void Configure(EntityTypeBuilder<CustomMigrationHistory> builder)
    {
        builder.ToTable("_CustomMigrationHistories");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}
