using System.Text;
using CreditCardApp.API.Middlewares;
using CreditCardApp.Application.UseCases.Auth;
using CreditCardApp.Domain.Ports;
using CreditCardApp.Infrastructure.Persistence;
using CreditCardApp.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var envPaths = new[]
{
    Path.Combine(builder.Environment.ContentRootPath, ".env"),
    Path.Combine(builder.Environment.ContentRootPath, "..", ".env"),
    Path.Combine(builder.Environment.ContentRootPath, "..", "..", ".env"),
};

var envFile = envPaths
    .Select(Path.GetFullPath)
    .FirstOrDefault(File.Exists);

if (envFile is not null)
{
    Console.WriteLine($"[ENV] Loading variables from: {envFile}");
    DotNetEnv.Env.Load(envFile);
}
else
{
    Console.WriteLine("[ENV] WARNING: .env file not found");
}

string GetEnv(string key, bool required = true, string? defaultValue = null)
{
    var value = Environment.GetEnvironmentVariable(key);

    if (string.IsNullOrWhiteSpace(value))
    {
        if (required && defaultValue is null)
            throw new Exception($"Missing required environment variable: {key}");

        return defaultValue ?? string.Empty;
    }

    return value;
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mysqlHost = GetEnv("MYSQL_HOST");
var mysqlPort = GetEnv("MYSQL_PORT", defaultValue: "3306");
var mysqlDb = GetEnv("MYSQL_DATABASE");
var mysqlUser = GetEnv("MYSQL_USER");
var mysqlPass = GetEnv("MYSQL_PASSWORD");

var connectionString =
    $"Server={mysqlHost};" +
    $"Port={mysqlPort};" +
    $"Database={mysqlDb};" +
    $"User ID={mysqlUser};" +
    $"Password={mysqlPass};" +
    $"SslMode=None;" +
    $"Allow User Variables=True;";

builder.Services.AddSingleton(new DbOptions
{
    ConnectionString = connectionString
});

var jwtOptions = new JwtOptions
{
    Issuer = GetEnv("JWT_ISSUER", defaultValue: "CreditCardApp"),
    Audience = GetEnv("JWT_AUDIENCE", defaultValue: "CreditCardApp"),
    SigningKey = GetEnv("JWT_SIGNING_KEY"), // REQUIRED
    ExpMinutes = int.TryParse(
        GetEnv("JWT_EXP_MINUTES", defaultValue: "60"),
        out var minutes
    ) ? minutes : 60
};

builder.Services.AddSingleton(jwtOptions);

builder.Services.AddScoped<IUserRepository, MySqlUserRepository>();
builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddSingleton<ITokenService>(_ =>
    new JwtTokenService(jwtOptions)
);

builder.Services.AddScoped<RegisterUserUseCase>();
builder.Services.AddScoped<LoginUseCase>();
builder.Services.AddScoped<GetMeUseCase>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.SigningKey)
            ),

            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
