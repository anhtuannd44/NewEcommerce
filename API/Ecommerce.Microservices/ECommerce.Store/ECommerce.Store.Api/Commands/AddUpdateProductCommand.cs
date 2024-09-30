using ECommerce.Common.Application.Common.Services;
using ECommerce.Store.Api.Entities;
using MediatR;

namespace ECommerce.Store.Api.Commands
{
    public class AddUpdateProductCommand : IRequest
    {
        public Product Product { get; set; }
    }

    public class AddUpdateProductCommandHandler(ICrudService<Product> productService) : IRequestHandler<AddUpdateProductCommand>
    {
        public async Task Handle(AddUpdateProductCommand command, CancellationToken cancellationToken = default)
        {
            await productService.AddOrUpdateAsync(command.Product, cancellationToken);
        }
    }
}
