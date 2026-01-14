using CreditCardApp.Application.DTOs.Auth;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Auth;

public class LoginUseCase
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokenService;

    public LoginUseCase(IUserRepository users, IPasswordHasher hasher, ITokenService tokenService)
    {
        _users = users;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> ExecuteAsync(LoginRequest req, CancellationToken ct)
    {
        var record = await _users.GetForAuthByUsernameAsync(req.Username, ct);

        if (record is null || !record.IsActive)
            throw new UnauthorizedAccessException("Credenciales inválidas.");

        var ok = _hasher.Verify(req.Password, record.PasswordHash, record.PasswordSalt);
        if (!ok)
            throw new UnauthorizedAccessException("Credenciales inválidas.");

        var token = _tokenService.CreateAccessToken(record.UserId, record.Username, record.Email);

        return new AuthResponse(token, new UserDto(record.UserId, record.Username, record.Email));
    }
}
