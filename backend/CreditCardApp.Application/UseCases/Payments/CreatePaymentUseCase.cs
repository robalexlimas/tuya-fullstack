using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Payments;

public class CreatePaymentUseCase
{
    private readonly ITransactionRepository _tx;
    public CreatePaymentUseCase(ITransactionRepository tx) => _tx = tx;

    public async Task<PaymentDto> ExecuteAsync(string userId, CreatePaymentRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.CardId))
            throw new ArgumentException("CardId es requerido.");

        if (req.Amount <= 0)
            throw new ArgumentException("Amount debe ser mayor que cero.");

        var tx = await _tx.RecordPaymentAsync(
            userId,
            req.CardId,
            req.Amount,
            req.Currency,
            req.Description,
            ct);

        if (tx is null)
            throw new InvalidOperationException("No se pudo registrar el pago.");

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
