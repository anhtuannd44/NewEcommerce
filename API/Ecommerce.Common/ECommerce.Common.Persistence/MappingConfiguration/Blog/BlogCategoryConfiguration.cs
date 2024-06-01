using ECommerce.Common.Domain.Entities.Blog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Blog;

public class BlogCategoryConfiguration : IEntityTypeConfiguration<BlogCategory>
{
    public void Configure(EntityTypeBuilder<BlogCategory> builder)
    {
        builder.ToTable("BlogCategory");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}