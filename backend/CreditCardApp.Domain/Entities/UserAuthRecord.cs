namespace CreditCardApp.Domain.Entities;

public class UserAuthRecord
{
    public string UserId { get; init; } = default!;
    public string Username { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string PasswordHash { get; init; } = default!;
    public string PasswordSalt { get; init; } = default!;
    public bool IsActive { get; init; }
}
