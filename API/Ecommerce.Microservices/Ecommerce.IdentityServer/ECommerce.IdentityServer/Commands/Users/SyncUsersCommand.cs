﻿using ECommerce.Common.Application.Common.Commands;
using ECommerce.IdentityServer.IdentityProviders;
using ECommerce.IdentityServer.IdentityProviders.Auth0;
using ECommerce.IdentityServer.IdentityProviders.Azure;
using ECommerce.IdentityServer.Repositories;

namespace ECommerce.IdentityServer.Commands.Users;

public class SyncUsersCommand : ICommand
{
    public int SyncedUsersCount { get; set; }
}

public class SyncUsersCommandHandler : ICommandHandler<SyncUsersCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IServiceProvider _serviceProvider;

    public SyncUsersCommandHandler(IUserRepository userRepository,
        IServiceProvider serviceProvider)
    {
        _userRepository = userRepository;
        _serviceProvider = serviceProvider;
    }

    public async Task HandleAsync(SyncUsersCommand command, CancellationToken cancellationToken = default)
    {
        await SyncToAuth0(command);

        await SyncToAzureAdB2C(command);
    }

    private async Task SyncToAzureAdB2C(SyncUsersCommand command)
    {
        var provider = (AzureActiveDirectoryB2CIdentityProvider)_serviceProvider.GetService(typeof(AzureActiveDirectoryB2CIdentityProvider));

        if (provider is null)
        {
            return;
        }

        var users = _userRepository.GetQueryableSet()
            .Where(x => x.AzureAdB2CUserId == null)
            .Take(50)
            .ToList();

        foreach (var user in users)
        {
            var existingUser = await provider.GetUserByUsernameAsync(user.UserName);

            if (existingUser != null)
            {
                user.AzureAdB2CUserId = existingUser.Id;
            }
            else
            {
                var newUser = new User
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Password = Guid.NewGuid().ToString(),
                    FirstName = "FirstName",
                    LastName = "LastName"
                };

                await provider.CreateUserAsync(newUser);

                user.AzureAdB2CUserId = newUser.Id;
            }

            await _userRepository.UnitOfWork.SaveChangesAsync();
        }

        command.SyncedUsersCount += users.Count;
    }

    private async Task SyncToAuth0(SyncUsersCommand command)
    {
        var provider = (Auth0IdentityProvider)_serviceProvider.GetService(typeof(Auth0IdentityProvider));

        if (provider is null)
        {
            return;
        }

        var users = _userRepository.GetQueryableSet()
            .Where(x => x.Auth0UserId == null)
            .Take(50)
            .ToList();

        foreach (var user in users)
        {
            var existingUser = await provider.GetUserByUsernameAsync(user.UserName);

            if (existingUser != null)
            {
                user.Auth0UserId = existingUser.Id;
            }
            else
            {
                var newUser = new User
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Password = Guid.NewGuid().ToString()
                };

                await provider.CreateUserAsync(newUser);

                user.Auth0UserId = newUser.Id;
            }

            await _userRepository.UnitOfWork.SaveChangesAsync();
        }

        command.SyncedUsersCount += users.Count;
    }
}