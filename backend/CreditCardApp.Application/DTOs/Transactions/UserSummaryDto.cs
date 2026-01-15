namespace CreditCardApp.Application.DTOs.Transactions;

public class UserSummaryDto
{
    public long TotalPayments { get; set; }
    public long TotalPurchases { get; set; }
    public long TotalRefunds { get; set; }
    public decimal TotalPaymentsAmount { get; set; }
    public decimal TotalPurchasesAmount { get; set; }
    public decimal TotalRefundsAmount { get; set; }
}
