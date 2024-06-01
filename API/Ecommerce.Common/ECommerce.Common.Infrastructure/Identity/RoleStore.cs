using ECommerce.Common.Domain.IRepositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Role = ECommerce.Common.Domain.Entities.Identity.Role;

namespace ECommerce.Common.Infrastructure.Identity;

public class RoleStore : IRoleStore<Role>
{
    private readonly IUnitOfWork _unitOfWork;

    public RoleStore(
        IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public void Dispose()
    {
    }

    public Task<IdentityResult> CreateAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<IdentityResult> DeleteAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Role> FindByIdAsync(string roleId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<Role> FindByNameAsync(string roleName, CancellationToken cancellationToken)
    {
        Role result = null;

        var role = await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name.Equals(roleName), cancellationToken: cancellationToken);

        if (role != null)
        {
            result = new Role()
            {
                Id = role.Id,
                Name = role.Name,
                Status = role.Status
            };
        }

        return result;
    }

    public Task<string> GetNormalizedRoleNameAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<string> GetRoleIdAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<string> GetRoleNameAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task SetNormalizedRoleNameAsync(Role role, string normalizedName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task SetRoleNameAsync(Role role, string roleName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<IdentityResult> UpdateAsync(Role role, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}