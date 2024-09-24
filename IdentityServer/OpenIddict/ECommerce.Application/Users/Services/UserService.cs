using ECommerce.Domain.Entities;
using ECommerce.Domain.Repositories;
using System;

namespace ECommerce.Application.Users.Services;

public class UserService : CrudService<User>, IUserService
{
    public UserService(IRepository<User, Guid> userRepository, Dispatcher dispatcher)
        : base(userRepository, dispatcher)
    {
    }
}
