using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Payments;

public class GetPaymentUseCase
{
    private readonly ITransactionRepository _tx;
    public GetPaymentUseCase(ITransactionRepository tx) => _tx = tx;

    public async Task<PaymentDto> ExecuteAsync(string userId, string transactionId, CancellationToken ct)
    {
        var tx = await _tx.GetByIdAsync(userId, transactionId, ct);
        if (tx is null || tx.Type != "PAYMENT")
            throw new KeyNotFoundException("Pago no encontrado.");

        return new PaymentDto
        {
            TransactionId = tx.TransactionId,
            CardId = tx.CardId,
            Amount = tx.Amount,
            Currency = tx.Currency,
            Description = tx.Description,
            Status = tx.Status,
            CreatedAtUtc = tx.CreatedAtUtc
        };
    }
}
