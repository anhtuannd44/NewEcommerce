using ECommerce.Common.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration;

public class UserLastRequestTimeConfiguration : IEntityTypeConfiguration<UserLastRequestTime>
{
    public void Configure(EntityTypeBuilder<UserLastRequestTime> builder)
    {
        builder.ToTable("UserLastRequestTime");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
        builder.Ignore(x => x.Version);
    }
}