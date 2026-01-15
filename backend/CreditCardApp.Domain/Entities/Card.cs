namespace CreditCardApp.Domain.Entities;

public class Card
{
    public string CardId { get; init; } = default!;
    public string UserId { get; init; } = default!;
    public string Brand { get; init; } = default!;
    public string Last4 { get; init; } = default!;
    public byte ExpMonth { get; init; }
    public short ExpYear { get; init; }
    public decimal CreditLimit { get; init; }
    public decimal AvailableCredit { get; init; }
    public string Status { get; init; } = default!;
    public string? Nickname { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
