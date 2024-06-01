using ECommerce.Common.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration;

public class FeatureMapping : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRole");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}