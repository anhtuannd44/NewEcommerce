using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Common.Domain.Entities.Products;

namespace ECommerce.Common.Persistence.MappingConfiguration.Products;

public class ProductAttributeCombinationConfiguration : IEntityTypeConfiguration<ProductAttributeCombination>
{
    public void Configure(EntityTypeBuilder<ProductAttributeCombination> builder)
    {
        builder.ToTable("ProductAttributeCombination");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}