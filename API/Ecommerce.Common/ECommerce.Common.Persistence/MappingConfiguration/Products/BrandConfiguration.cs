using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.ToTable("Brand");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}