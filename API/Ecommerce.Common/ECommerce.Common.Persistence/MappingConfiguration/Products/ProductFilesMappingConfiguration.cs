using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductFilesMappingConfiguration : IEntityTypeConfiguration<ProductFilesMapping>
{
    public void Configure(EntityTypeBuilder<ProductFilesMapping> builder)
    {
        builder.ToTable("ProductFilesMapping");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}