using ECommerce.Domain.Entities;
using System.Collections.Generic;

namespace ECommerce.IdentityServer.Models.UserModels;

public class RolesModel
{
    public User User { get; set; }

    public RoleModel Role { get; set; }

    public List<Role> Roles { get; set; }

    public List<RoleModel> UserRoles { get; set; }
}
