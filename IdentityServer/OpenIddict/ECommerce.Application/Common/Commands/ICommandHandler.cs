using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application;

public interface ICommandHandler<TCommand>
    where TCommand : ICommand
{
    Task HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}
