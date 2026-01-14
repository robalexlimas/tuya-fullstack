using CreditCardApp.Application.DTOs.Auth;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Auth;

public class GetMeUseCase
{
    private readonly IUserRepository _users;
    public GetMeUseCase(IUserRepository users) => _users = users;

    public async Task<UserDto> ExecuteAsync(string userId, CancellationToken ct)
    {
        var user = await _users.GetByIdAsync(userId, ct)
                   ?? throw new KeyNotFoundException("Usuario no encontrado.");

        return new UserDto(user.UserId, user.Username, user.Email);
    }
}
