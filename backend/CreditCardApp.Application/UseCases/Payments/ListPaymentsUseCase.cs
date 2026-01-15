using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Payments;

public class ListPaymentsUseCase
{
    private readonly ITransactionRepository _tx;
    public ListPaymentsUseCase(ITransactionRepository tx) => _tx = tx;

    public async Task<IReadOnlyList<PaymentDto>> ExecuteAsync(string userId, string? cardId, CancellationToken ct)
    {
        var list = await _tx.GetPaymentsByUserAsync(userId, cardId, ct);

        return list.Select(t => new PaymentDto
        {
            TransactionId = t.TransactionId,
            CardId = t.CardId,
            Amount = t.Amount,
            Currency = t.Currency,
            Description = t.Description,
            Status = t.Status,
            CreatedAtUtc = t.CreatedAtUtc
        }).ToList();
    }
}
