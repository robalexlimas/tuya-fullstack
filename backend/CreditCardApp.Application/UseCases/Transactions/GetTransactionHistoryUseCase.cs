using CreditCardApp.Application.DTOs.Transactions;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Transactions;

public class GetTransactionHistoryUseCase
{
    private readonly ITransactionRepository _repo;
    public GetTransactionHistoryUseCase(ITransactionRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<TransactionHistoryDto>> ExecuteAsync(string userId, string transactionId, CancellationToken ct)
    {
        var list = await _repo.GetTransactionHistoryAsync(userId, transactionId, ct);
        if (list.Count == 0) throw new KeyNotFoundException("Transacción no encontrada para este usuario.");

        return list.Select(h => new TransactionHistoryDto
        {
            HistoryId = h.HistoryId,
            TransactionId = h.TransactionId,
            OldStatus = h.OldStatus,
            NewStatus = h.NewStatus,
            OldAmount = h.OldAmount,
            NewAmount = h.NewAmount,
            ChangedAtUtc = h.ChangedAtUtc
        }).ToList();
    }
}
