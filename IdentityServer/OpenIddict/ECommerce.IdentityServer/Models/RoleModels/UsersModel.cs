﻿using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;

namespace ECommerce.IdentityServer.Models.RoleModels;

public class UsersModel
{
    public Role Role { get; set; }

    public List<User> Users { get; set; }
}
