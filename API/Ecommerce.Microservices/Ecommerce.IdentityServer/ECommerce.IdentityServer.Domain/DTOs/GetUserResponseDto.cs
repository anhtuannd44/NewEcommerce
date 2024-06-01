using System.Collections;

namespace ECommerce.IdentityServer.Domain.DTOs;

public class GetUserResponseDto
{
    public IEnumerable Data { get; set; }
    public int Total { get; set; }
    public object Errors { get; set; }
}