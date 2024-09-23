using ECommerce.Common.Application.Common.Commands;
using ECommerce.IdentityServer.Entities;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Commands.Roles;

public class DeleteClaimCommand : ICommand
{
    public Role Role { get; set; }
    public RoleClaim Claim { get; set; }
}

public class DeleteClaimCommandHandler : ICommandHandler<DeleteClaimCommand>
{
    private readonly IRoleRepository _roleRepository;

    public DeleteClaimCommandHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task HandleAsync(DeleteClaimCommand command, CancellationToken cancellationToken = default)
    {
        command.Role.Claims.Remove(command.Claim);
        await _roleRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
    }
}