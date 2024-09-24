using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence;

public class OpenIddictDbContext : DbContext
{
    public OpenIddictDbContext(DbContextOptions<OpenIddictDbContext> options)
        : base(options)
    {
    }
}
