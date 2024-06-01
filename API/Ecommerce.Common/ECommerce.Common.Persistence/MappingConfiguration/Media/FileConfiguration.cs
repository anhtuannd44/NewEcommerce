using ECommerce.Common.Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Media;

public class FileConfiguration : IEntityTypeConfiguration<Files>
{
    public void Configure(EntityTypeBuilder<Files> builder)
    {
        builder.ToTable("Files");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}