using ECommerce.Domain.Entities;
using ECommerce.Domain.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application.Roles.Commands;

public class DeleteRoleCommand : ICommand
{
    public Role Role { get; set; }
}

internal class DeleteRoleCommandHandler : ICommandHandler<DeleteRoleCommand>
{
    private readonly IRoleRepository _roleRepository;

    public DeleteRoleCommandHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task HandleAsync(DeleteRoleCommand command, CancellationToken cancellationToken = default)
    {
        _roleRepository.Delete(command.Role);
        await _roleRepository.UnitOfWork.SaveChangesAsync();
    }
}
