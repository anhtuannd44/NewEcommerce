FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /ECommerce.Microservices

# Copy csproj and restore as distinct layers
COPY ./Common/ECommerce.Application/*.csproj ./Common/ECommerce.Application/
COPY ./Common/ECommerce.CrossCuttingConcerns/*.csproj ./Common/ECommerce.CrossCuttingConcerns/
COPY ./Common/ECommerce.Domain/*.csproj ./Common/ECommerce.Domain/
COPY ./Common/ECommerce.Infrastructure/*.csproj ./Common/ECommerce.Infrastructure/
RUN dotnet restore ./Common/ECommerce.Application/ECommerce.Application.csproj
RUN dotnet restore ./Common/ECommerce.Infrastructure/ECommerce.Infrastructure.csproj

COPY ./Services.Notification/ECommerce.Services.Notification/*.csproj ./Services.Notification/ECommerce.Services.Notification/
RUN dotnet restore ./Services.Notification/ECommerce.Services.Notification/ECommerce.Services.Notification.csproj

COPY ./Services.Notification/ECommerce.Services.Notification.Api/*.csproj ./Services.Notification/ECommerce.Services.Notification.Api/
RUN dotnet restore ./Services.Notification/ECommerce.Services.Notification.Api/ECommerce.Services.Notification.Api.csproj

# Copy everything else and build ECommerce
COPY . ./
RUN dotnet publish ./Services.Notification/ECommerce.Services.Notification.Api/ECommerce.Services.Notification.Api.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /ECommerce.Microservices
COPY --from=build-env /ECommerce.Microservices/out .

ENTRYPOINT ["dotnet", "ECommerce.Services.Notification.Api.dll"]