using ECommerce.Common.Application.Common.Commands;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Commands.Users;

public class DeleteUserCommand : ICommand
{
    public User User { get; set; }
}

public class DeleteUserCommandHandler : ICommandHandler<DeleteUserCommand>
{
    private readonly IUserRepository _userRepository;

    public DeleteUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task HandleAsync(DeleteUserCommand command, CancellationToken cancellationToken = default)
    {
        _userRepository.Delete(command.User);
        await _userRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}