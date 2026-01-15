namespace CreditCardApp.Domain.Entities;

public class UserSummary
{
    public long TotalPayments { get; init; }
    public long TotalPurchases { get; init; }
    public long TotalRefunds { get; init; }
    public decimal TotalPaymentsAmount { get; init; }
    public decimal TotalPurchasesAmount { get; init; }
    public decimal TotalRefundsAmount { get; init; }
}
