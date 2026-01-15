namespace CreditCardApp.Application.DTOs.Payments;

public class PaymentDto
{
    public string TransactionId { get; set; } = default!;
    public string CardId { get; set; } = default!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = default!;
    public string? Description { get; set; }
    public string Status { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; }
}
