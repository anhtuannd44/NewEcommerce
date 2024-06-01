using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductAttributeValueConfiguration : IEntityTypeConfiguration<ProductAttributeValue>
{
    public void Configure(EntityTypeBuilder<ProductAttributeValue> builder)
    {
        builder.ToTable("ProductAttributeValue");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}