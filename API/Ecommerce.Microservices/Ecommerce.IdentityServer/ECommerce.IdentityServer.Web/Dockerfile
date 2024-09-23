FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /ECommerece.Microservices

# Copy csproj and restore as distinct layers
COPY ./Common/ECommerece.Application/*.csproj ./Common/ECommerece.Application/
COPY ./Common/ECommerece.CrossCuttingConcerns/*.csproj ./Common/ECommerece.CrossCuttingConcerns/
COPY ./Common/ECommerece.Domain/*.csproj ./Common/ECommerece.Domain/
COPY ./Common/ECommerece.Infrastructure/*.csproj ./Common/ECommerece.Infrastructure/
RUN dotnet restore ./Common/ECommerece.Application/ECommerece.Application.csproj
RUN dotnet restore ./Common/ECommerece.Infrastructure/ECommerece.Infrastructure.csproj

COPY ./Services.Identity/ECommerece.Services.Identity/*.csproj ./Services.Identity/ECommerece.Services.Identity/
RUN dotnet restore ./Services.Identity/ECommerece.Services.Identity/ECommerece.Services.Identity.csproj

COPY ./Services.Identity/ECommerece.Services.Identity.Api/*.csproj ./Services.Identity/ECommerece.Services.Identity.Api/
RUN dotnet restore ./Services.Identity/ECommerece.Services.Identity.Api/ECommerece.Services.Identity.Api.csproj

# Copy everything else and build ECommerece
COPY . ./
RUN dotnet publish ./Services.Identity/ECommerece.Services.Identity.Api/ECommerece.Services.Identity.Api.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /ECommerece.Microservices
COPY --from=build-env /ECommerece.Microservices/out .

ENTRYPOINT ["dotnet", "ECommerece.Services.Identity.Api.dll"]