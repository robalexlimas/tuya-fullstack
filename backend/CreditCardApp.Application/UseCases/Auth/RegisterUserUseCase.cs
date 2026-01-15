using CreditCardApp.Application.DTOs.Auth;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Auth;

public class RegisterUserUseCase
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokenService;

    public RegisterUserUseCase(IUserRepository users, IPasswordHasher hasher, ITokenService tokenService)
    {
        _users = users;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> ExecuteAsync(RegisterRequest req, CancellationToken ct)
    {
        var (hash, salt) = _hasher.HashPassword(req.Password);

        var created = await _users.CreateAsync(req.Username, req.Email, hash, salt, ct)
                     ?? throw new InvalidOperationException("No se pudo crear el usuario.");

        var token = _tokenService.CreateAccessToken(created.UserId, created.Username, created.Email);

        return new AuthResponse(token, new UserDto(created.UserId, created.Username, created.Email));
    }
}
