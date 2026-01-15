namespace CreditCardApp.Application.DTOs.Payments;

public class UpdateTransactionStatusRequest
{
    public string NewStatus { get; set; } = default!; // PENDING/COMPLETED/FAILED
}
