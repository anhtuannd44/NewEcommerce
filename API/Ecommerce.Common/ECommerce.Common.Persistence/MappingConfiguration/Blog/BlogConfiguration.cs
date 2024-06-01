using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Blog;

public class BlogConfiguration : IEntityTypeConfiguration<Domain.Entities.Blog.Blog>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Blog.Blog> builder)
    {
        builder.ToTable("Blog");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}