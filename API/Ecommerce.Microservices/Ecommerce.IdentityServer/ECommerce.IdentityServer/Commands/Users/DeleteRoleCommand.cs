using ECommerce.Common.Application.Common.Commands;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Commands.Users;

public class DeleteRoleCommand : ICommand
{
    public User User { get; set; }
    public UserRole Role { get; set; }
}

public class DeleteRoleCommandHandler : ICommandHandler<DeleteRoleCommand>
{
    private readonly IUserRepository _userRepository;

    public DeleteRoleCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task HandleAsync(DeleteRoleCommand command, CancellationToken cancellationToken = default)
    {
        command.User.UserRoles.Remove(command.Role);
        await _userRepository.AddOrUpdateAsync(command.User);
        await _userRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}