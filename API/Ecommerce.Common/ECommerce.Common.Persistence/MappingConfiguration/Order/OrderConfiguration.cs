using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders = ECommerce.Common.Domain.Entities.Orders.Order;

namespace ECommerce.Common.Persistence.MappingConfiguration.Order;

public class OrderConfiguration : IEntityTypeConfiguration<Orders>
{
    public void Configure(EntityTypeBuilder<Orders> builder)
    {
        builder.ToTable("Order");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}