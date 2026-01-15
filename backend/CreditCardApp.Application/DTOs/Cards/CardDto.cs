namespace CreditCardApp.Application.DTOs.Cards;

public class CardDto
{
    public string CardId { get; set; } = default!;
    public string Brand { get; set; } = default!;
    public string Last4 { get; set; } = default!;
    public byte ExpMonth { get; set; }
    public short ExpYear { get; set; }
    public decimal CreditLimit { get; set; }
    public decimal AvailableCredit { get; set; }
    public string Status { get; set; } = default!;
    public string? Nickname { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
