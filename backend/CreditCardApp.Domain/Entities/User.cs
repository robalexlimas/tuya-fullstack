namespace CreditCardApp.Domain.Entities;

public class User
{
    public string UserId { get; init; } = default!;
    public string Username { get; init; } = default!;
    public string Email { get; init; } = default!;
    public bool IsActive { get; init; }
    public DateTime CreatedAtUtc { get; init; }
}
