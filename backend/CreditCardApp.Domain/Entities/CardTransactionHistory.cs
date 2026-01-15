namespace CreditCardApp.Domain.Entities;

public class CardTransactionHistory
{
    public ulong HistoryId { get; init; }
    public string TransactionId { get; init; } = default!;
    public string? OldStatus { get; init; }
    public string NewStatus { get; init; } = default!;
    public decimal? OldAmount { get; init; }
    public decimal NewAmount { get; init; }
    public DateTime ChangedAtUtc { get; init; }
}
