using ECommerce.IdentityServer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.IdentityServer.MappingConfigurations;

public class UserConfiguration: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.Property(x => x.Id).HasDefaultValueSql("newsequentialid()");

        builder.HasMany(x => x.Claims)
            .WithOne(x => x.User)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.UserRoles)
            .WithOne(x => x.User)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed
        builder.HasData(new List<User>
        {
            new User
            {
                Id = Guid.Parse("12837D3D-793F-EA11-BECB-5CEA1D05F660"),
                UserName = "anhtuan.nd44@gmail.com",
                NormalizedUserName = "ANHTUAN.ND44@GMAIL.COM",
                Email = "anhtuan.nd44@gmail.com",
                NormalizedEmail = "ANHTUAN.ND44@GMAIL.COM",
                PasswordHash = "AQAAAAEAACcQAAAAELBcKuXWkiRQEYAkD/qKs9neac5hxWs3bkegIHpGLtf+zFHuKnuI3lBqkWO9TMmFAQ==", // v*7Un8b4rcN@<-RN
                SecurityStamp = "5M2QLL65J6H6VFIS7VZETKXY27KNVVYJ",
                LockoutEnabled = true,
            },
        });
    }
}
