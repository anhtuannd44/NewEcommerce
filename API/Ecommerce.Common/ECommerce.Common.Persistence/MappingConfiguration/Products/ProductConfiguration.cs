using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Product");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}