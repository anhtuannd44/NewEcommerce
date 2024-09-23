using ECommerce.Common.Application.Common.Commands;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Commands.Roles;

public class AddUpdateRoleCommand : ICommand
{
    public Role Role { get; set; }
}

public class AddUpdateRoleCommandHandler : ICommandHandler<AddUpdateRoleCommand>
{
    private readonly IRoleRepository _roleRepository;

    public AddUpdateRoleCommandHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task HandleAsync(AddUpdateRoleCommand command, CancellationToken cancellationToken = default)
    {
        await _roleRepository.AddOrUpdateAsync(command.Role);
        await _roleRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}