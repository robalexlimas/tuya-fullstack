using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Payments;

public class FinalizeTransactionUseCase
{
    private readonly ITransactionRepository _tx;
    public FinalizeTransactionUseCase(ITransactionRepository tx) => _tx = tx;

    public async Task<PaymentDto> ExecuteAsync(string userId, string transactionId, UpdateTransactionStatusRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.NewStatus))
            throw new ArgumentException("NewStatus es requerido.");

        var updated = await _tx.FinalizeAsync(userId, transactionId, req.NewStatus, ct);
        if (updated is null)
            throw new KeyNotFoundException("Transacción no encontrada para este usuario.");

        return new PaymentDto
        {
            TransactionId = updated.TransactionId,
            CardId = updated.CardId,
            Amount = updated.Amount,
            Currency = updated.Currency,
            Description = updated.Description,
            Status = updated.Status,
            CreatedAtUtc = updated.CreatedAtUtc
        };
    }
}
