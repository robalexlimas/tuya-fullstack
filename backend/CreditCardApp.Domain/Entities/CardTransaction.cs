namespace CreditCardApp.Domain.Entities;

public class CardTransaction
{
    public string TransactionId { get; init; } = default!;
    public string CardId { get; init; } = default!;
    public string UserId { get; init; } = default!;
    public string Type { get; init; } = default!;        // PAYMENT/PURCHASE/REFUND
    public decimal Amount { get; init; }
    public string Currency { get; init; } = default!;
    public string? Merchant { get; init; }
    public string? Description { get; init; }
    public string Status { get; init; } = default!;      // PENDING/COMPLETED/FAILED
    public DateTime CreatedAtUtc { get; init; }
}
