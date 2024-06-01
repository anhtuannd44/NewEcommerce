using ECommerce.Common.Domain.Entities.Blog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Common.Persistence.MappingConfiguration.Blog;

public class BlogCategoryRelationConfiguration : IEntityTypeConfiguration<BlogCategoryRelation>
{
    public void Configure(EntityTypeBuilder<BlogCategoryRelation> builder)
    {
        builder.ToTable("BlogCategoryRelation");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");
    }
}