namespace CreditCardApp.Application.DTOs.Payments;

public class CreatePaymentRequest
{
    public string CardId { get; set; } = default!;
    public decimal Amount { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? Description { get; set; }
}
