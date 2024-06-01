using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductCategoryConfiguration : IEntityTypeConfiguration<ProductCategory>
{
    public void Configure(EntityTypeBuilder<ProductCategory> builder)
    {
        builder.ToTable("ProductCategory");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}