using ECommerce.Notification.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Notification.MappingConfigurations;

public class EmailMessageAttachmentConfiguration : IEntityTypeConfiguration<EmailMessageAttachment>
{
    public void Configure(EntityTypeBuilder<EmailMessageAttachment> builder)
    {
        builder.ToTable("EmailMessageAttachments");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}
