FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj first (better cache)
COPY backend/CreditCardApp.sln backend/CreditCardApp.sln
COPY backend/CreditCardApp.API/CreditCardApp.API.csproj backend/CreditCardApp.API/
COPY backend/CreditCardApp.Application/CreditCardApp.Application.csproj backend/CreditCardApp.Application/
COPY backend/CreditCardApp.Domain/CreditCardApp.Domain.csproj backend/CreditCardApp.Domain/
COPY backend/CreditCardApp.Infrastructure/CreditCardApp.Infrastructure.csproj backend/CreditCardApp.Infrastructure/

RUN dotnet restore backend/CreditCardApp.sln

# Copy everything
COPY backend/ backend/

WORKDIR /src/backend/CreditCardApp.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish ./

# Copy root .env into container at /app/.env (important)
COPY .env ./.env

# ASPNET config
ENV ASPNETCORE_URLS=http://0.0.0.0:5253
EXPOSE 5253

ENTRYPOINT ["dotnet", "CreditCardApp.API.dll"]
