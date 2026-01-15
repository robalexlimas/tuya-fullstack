namespace CreditCardApp.Application.DTOs.Transactions;

public class TransactionHistoryDto
{
    public ulong HistoryId { get; set; }
    public string TransactionId { get; set; } = default!;
    public string? OldStatus { get; set; }
    public string NewStatus { get; set; } = default!;
    public decimal? OldAmount { get; set; }
    public decimal NewAmount { get; set; }
    public DateTime ChangedAtUtc { get; set; }
}
