namespace ECommerce.IdentityServer.Domain.DTOs
{
    public class GetByIdUserDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
    }
}