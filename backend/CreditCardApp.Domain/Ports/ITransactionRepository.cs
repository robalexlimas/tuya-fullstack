using CreditCardApp.Domain.Entities;

namespace CreditCardApp.Domain.Ports;

public interface ITransactionRepository
{
    // PAYMENTS
    Task<CardTransaction?> RecordPaymentAsync(
        string userId,
        string cardId,
        decimal amount,
        string? currency,
        string? description,
        CancellationToken ct);

    Task<IReadOnlyList<CardTransaction>> GetPaymentsByUserAsync(
        string userId,
        string? cardId,
        CancellationToken ct);

    // (Opcional) detalle puntual
    Task<CardTransaction?> GetByIdAsync(string userId, string transactionId, CancellationToken ct);

    // (General) actualizar estado (usa sp_finalize_transaction)
    Task<CardTransaction?> FinalizeAsync(string userId, string transactionId, string newStatus, CancellationToken ct);
}
