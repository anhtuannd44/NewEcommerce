using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
{
    public void Configure(EntityTypeBuilder<ProductAttribute> builder)
    {
        builder.ToTable("ProductAttribute");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}