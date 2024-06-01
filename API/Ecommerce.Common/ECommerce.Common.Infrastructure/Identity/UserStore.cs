using System.ComponentModel.DataAnnotations;
using ECommerce.Common.Domain.Entities;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using User = ECommerce.Common.Domain.Entities.Identity.User;

namespace ECommerce.Common.Infrastructure.Identity;

public class UserStore : IUserPasswordStore<User>,
    IUserSecurityStampStore<User>,
    IUserEmailStore<User>,
    IUserPhoneNumberStore<User>,
    IUserTwoFactorStore<User>,
    IUserLockoutStore<User>,
    IUserAuthenticationTokenStore<User>,
    IUserAuthenticatorKeyStore<User>,
    IUserTwoFactorRecoveryCodeStore<User>

{
    private readonly IUnitOfWork _unitOfWork;

    private const string AuthenticatorStoreLoginProvider = "[AuthenticatorStore]";
    private const string AuthenticatorKeyTokenName = "AuthenticatorKey";
    private const string RecoveryCodeTokenName = "RecoveryCodes";

    public UserStore(
        IUnitOfWork unitOfWork
    )
    {
        _unitOfWork = unitOfWork;
    }

    public void Dispose()
    {
    }

    public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
    {
        if (user == null)
        {
            throw new ValidationException("data is null");
        }

        user.PasswordHistories = new List<PasswordHistory>()
        {
            new PasswordHistory
            {
                PasswordHash = user.PasswordHash,
                CreatedDate = DateTime.Now
            }
        };

        _unitOfWork.Repository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(new IdentityResult());
    }

    public async Task<User> FindByEmailAsync(string normalizedEmail)
    {
        return await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Email == normalizedEmail);
    }

    public async Task<User> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        return await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
    }

    public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        var userIdAsGuid = Guid.Parse(userId);
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(i => i.Id == userIdAsGuid, cancellationToken: cancellationToken);
        return user;
    }

    public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(normalizedUserName))
        {
            throw new ArgumentException("Null or empty argument: userName");
        }

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(i => i.UserName == normalizedUserName && i.Status == UserStatus.Active, cancellationToken);
        return user;
    }

    public Task<int> GetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.AccessFailedCount);
    }

    public Task<string> GetEmailAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(true);
    }

    public Task<bool> GetLockoutEnabledAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.LockoutEnabled);
    }

    public Task<DateTimeOffset?> GetLockoutEndDateAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.LockoutEnd);
    }

    public Task<string> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.PasswordHash);
    }

    public Task<string> GetPhoneNumberAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(string.Empty);
    }

    public Task<bool> GetPhoneNumberConfirmedAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(false);
    }

    public Task<string> GetSecurityStampAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.SecurityStamp ?? string.Empty);
    }

    public Task<bool> GetTwoFactorEnabledAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(false);
    }

    public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Id.ToString());
    }

    public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.PasswordHash != null);
    }

    public Task<int> IncrementAccessFailedCountAsync(User user, CancellationToken cancellationToken)
    {
        user.AccessFailedCount++;
        return Task.FromResult(user.AccessFailedCount);
    }

    public Task ResetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
    {
        user.AccessFailedCount = 0;
        return Task.CompletedTask;
    }

    public Task SetEmailAsync(User user, string email, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetLockoutEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
    {
        user.LockoutEnabled = enabled;
        return Task.CompletedTask;
    }

    public Task SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
    {
        user.LockoutEnd = lockoutEnd;
        return Task.CompletedTask;
    }

    public Task SetNormalizedEmailAsync(User user, string normalizedEmail, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
    {
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }

    public Task SetPhoneNumberAsync(User user, string phoneNumber, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetPhoneNumberConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetSecurityStampAsync(User user, string stamp, CancellationToken cancellationToken)
    {
        user.SecurityStamp = stamp;
        return Task.CompletedTask;
    }

    public Task SetTwoFactorEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
    {
        user.UserName = userName;
        return Task.CompletedTask;
    }

    public async Task<IdentityResult> UpdateAsync(User userDto, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(userDto);

        try
        {
            await _unitOfWork.SaveChangesAsync();

            return IdentityResult.Success;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            foreach (var entry in ex.Entries)
            {
                entry.OriginalValues.SetValues(await entry.GetDatabaseValuesAsync(cancellationToken) ?? throw new InvalidOperationException());
            }

            await _unitOfWork.SaveChangesAsync();

            return IdentityResult.Failed();
        }
    }

    public Task<string> GetTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken)
    {
        return Task.FromResult(string.Empty);
    }

    public Task SetTokenAsync(User user, string loginProvider, string name, string value,
        CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task RemoveTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task SetAuthenticatorKeyAsync(User user, string key, CancellationToken cancellationToken)
    {
        return SetTokenAsync(user, AuthenticatorStoreLoginProvider, AuthenticatorKeyTokenName, key, cancellationToken);
    }

    public Task<string> GetAuthenticatorKeyAsync(User user, CancellationToken cancellationToken)
    {
        return GetTokenAsync(user, AuthenticatorStoreLoginProvider, AuthenticatorKeyTokenName, cancellationToken);
    }

    public Task ReplaceCodesAsync(User user, IEnumerable<string> recoveryCodes, CancellationToken cancellationToken)
    {
        var mergedCodes = string.Join(";", recoveryCodes);
        return SetTokenAsync(user, AuthenticatorStoreLoginProvider, RecoveryCodeTokenName, mergedCodes,
            cancellationToken);
    }

    public async Task<bool> RedeemCodeAsync(User user, string code, CancellationToken cancellationToken)
    {
        var mergedCodes =
            await GetTokenAsync(user, AuthenticatorStoreLoginProvider, RecoveryCodeTokenName, cancellationToken) ?? "";
        var splitCodes = mergedCodes.Split(';');
        
        if (!splitCodes.Contains(code))
        {
            return false;
        }

        var updatedCodes = new List<string>(splitCodes.Where(s => s != code));
        await ReplaceCodesAsync(user, updatedCodes, cancellationToken);
        return true;
    }

    public async Task<int> CountCodesAsync(User user, CancellationToken cancellationToken)
    {
        var mergedCodes =
            await GetTokenAsync(user, AuthenticatorStoreLoginProvider, RecoveryCodeTokenName, cancellationToken) ?? "";
        return mergedCodes.Length > 0 ? mergedCodes.Split(';').Length : 0;
    }
}