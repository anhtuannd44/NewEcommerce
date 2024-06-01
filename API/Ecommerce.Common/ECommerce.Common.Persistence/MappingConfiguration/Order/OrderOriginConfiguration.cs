using ECommerce.Common.Domain.Entities.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Order;

public class OrderOriginConfiguration : IEntityTypeConfiguration<OrderOrigin>
{
    public void Configure(EntityTypeBuilder<OrderOrigin> builder)
    {
        builder.ToTable("OrderOrigin");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}