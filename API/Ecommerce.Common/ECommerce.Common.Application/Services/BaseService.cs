using ECommerce.Common.Domain.IRepositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Common.Application.Services;

public class BaseService(
    IConfiguration configuration,
    ILogger logger,
    IUnitOfWork unitOfWork)
{
    protected readonly IConfiguration _configuration = configuration;
    protected readonly IUnitOfWork _unitOfWork = unitOfWork;
    protected readonly ILogger _logger = logger;
}