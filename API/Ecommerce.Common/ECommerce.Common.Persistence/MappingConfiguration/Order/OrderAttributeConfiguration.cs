using ECommerce.Common.Domain.Entities.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Order;

public class OrderAttributeConfiguration : IEntityTypeConfiguration<OrderAttribute>
{
    public void Configure(EntityTypeBuilder<OrderAttribute> builder)
    {
        builder.ToTable("OrderAttribute");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}