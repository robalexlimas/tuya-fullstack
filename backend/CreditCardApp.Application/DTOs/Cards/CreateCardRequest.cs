namespace CreditCardApp.Application.DTOs.Cards;

public class CreateCardRequest
{
    public string Brand { get; set; } = default!;
    public string Last4 { get; set; } = default!;
    public byte ExpMonth { get; set; }
    public short ExpYear { get; set; }
    public decimal CreditLimit { get; set; }
    public string? Nickname { get; set; }
}
