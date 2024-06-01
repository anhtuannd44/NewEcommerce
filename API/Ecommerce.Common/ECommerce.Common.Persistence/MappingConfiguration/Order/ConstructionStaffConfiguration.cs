using ECommerce.Common.Domain.Entities.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders = ECommerce.Common.Domain.Entities.Orders.Order;

namespace ECommerce.Common.Persistence.MappingConfiguration.Order;

public class ConstructionStaffConfiguration : IEntityTypeConfiguration<ConstructionStaff>
{
    public void Configure(EntityTypeBuilder<ConstructionStaff> builder)
    {
        builder.ToTable("ConstructionStaff");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}