using ECommerce.Common.Domain.IRepositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Common.Application.Services;

public abstract class BaseService<T>(IConfiguration configuration, IUnitOfWork unitOfWork, ILogger<T> logger)
    where T : class
{
    protected readonly IConfiguration _configuration = configuration;
    protected readonly IUnitOfWork _unitOfWork = unitOfWork;
    protected readonly ILogger<T> _logger = logger;
}