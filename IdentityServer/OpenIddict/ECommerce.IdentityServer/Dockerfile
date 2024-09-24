FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /ECommerce.IdentityServer

# Copy csproj and restore as distinct layers
COPY ./ECommerce.Application/*.csproj ./ECommerce.Application/
COPY ./ECommerce.CrossCuttingConcerns/*.csproj ./ECommerce.CrossCuttingConcerns/
COPY ./ECommerce.Domain/*.csproj ./ECommerce.Domain/
COPY ./ECommerce.IdentityServer/*.csproj ./ECommerce.IdentityServer/
COPY ./ECommerce.Infrastructure/*.csproj ./ECommerce.Infrastructure/
COPY ./ECommerce.Migrator/*.csproj ./ECommerce.Migrator/
COPY ./ECommerce.Persistence/*.csproj ./ECommerce.Persistence/
COPY ./ECommerce.OpenIddict.sln .
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish ./ECommerce.IdentityServer/ECommerce.IdentityServer.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /ECommerce.IdentityServer
COPY --from=build-env /ECommerce.IdentityServer/out .

ENTRYPOINT ["dotnet", "ECommerce.IdentityServer.dll"]