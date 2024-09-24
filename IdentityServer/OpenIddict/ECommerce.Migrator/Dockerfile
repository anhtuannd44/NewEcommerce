FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /ECommerce.Monolith

# Copy csproj and restore as distinct layers
COPY ./ECommerce.Application/*.csproj ./ECommerce.Application/
COPY ./ECommerce.ArchTests/*.csproj ./ECommerce.ArchTests/
COPY ./ECommerce.BackgroundServer/*.csproj ./ECommerce.BackgroundServer/
COPY ./ECommerce.Blazor.Modules/*.csproj ./ECommerce.Blazor.Modules/
COPY ./ECommerce.BlazorServerSide/*.csproj ./ECommerce.BlazorServerSide/
COPY ./ECommerce.BlazorWebAssembly/*.csproj ./ECommerce.BlazorWebAssembly/
COPY ./ECommerce.ContractTests/*.csproj ./ECommerce.ContractTests/
COPY ./ECommerce.CrossCuttingConcerns/*.csproj ./ECommerce.CrossCuttingConcerns/
COPY ./ECommerce.Domain/*.csproj ./ECommerce.Domain/
COPY ./ECommerce.EndToEndTests/*.csproj ./ECommerce.EndToEndTests/
COPY ./ECommerce.GraphQL/*.csproj ./ECommerce.GraphQL/
COPY ./ECommerce.IdentityServer/*.csproj ./ECommerce.IdentityServer/
COPY ./ECommerce.Infrastructure/*.csproj ./ECommerce.Infrastructure/
COPY ./ECommerce.IntegrationTests/*.csproj ./ECommerce.IntegrationTests/
COPY ./ECommerce.Migrator/*.csproj ./ECommerce.Migrator/
COPY ./ECommerce.Persistence/*.csproj ./ECommerce.Persistence/
COPY ./ECommerce.UnitTests/*.csproj ./ECommerce.UnitTests/
COPY ./ECommerce.WebAPI/*.csproj ./ECommerce.WebAPI/
COPY ./ECommerce.WebMVC/*.csproj ./ECommerce.WebMVC/
COPY ./ECommerce.Monolith.sln .
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish ./ECommerce.Migrator/ECommerce.Migrator.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /ECommerce.Monolith
COPY --from=build-env /ECommerce.Monolith/out .

ENTRYPOINT ["dotnet", "ECommerce.Migrator.dll"]