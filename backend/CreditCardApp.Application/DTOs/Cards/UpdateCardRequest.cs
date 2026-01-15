namespace CreditCardApp.Application.DTOs.Cards;

public class UpdateCardRequest
{
    public string Brand { get; set; } = default!;
    public byte ExpMonth { get; set; }
    public short ExpYear { get; set; }
    public string? Nickname { get; set; }
    public string Status { get; set; } = "ACTIVE"; // ACTIVE/BLOCKED/CLOSED
}
