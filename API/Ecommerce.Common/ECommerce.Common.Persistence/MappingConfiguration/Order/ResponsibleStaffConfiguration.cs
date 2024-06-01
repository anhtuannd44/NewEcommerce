using ECommerce.Common.Domain.Entities.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders = ECommerce.Common.Domain.Entities.Orders.Order;

namespace ECommerce.Common.Persistence.MappingConfiguration.Order;

public class ResponsibleStaffConfiguration : IEntityTypeConfiguration<ResponsibleStaff>
{
    public void Configure(EntityTypeBuilder<ResponsibleStaff> builder)
    {
        builder.ToTable("ResponsibleStaff");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}