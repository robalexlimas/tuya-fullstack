using CreditCardApp.Application.DTOs.Transactions;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Transactions;

public class ListTransactionsUseCase
{
    private readonly ITransactionRepository _repo;
    public ListTransactionsUseCase(ITransactionRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<TransactionDto>> ExecuteAsync(string userId, string? cardId, string? status, CancellationToken ct)
    {
        var list = await _repo.GetTransactionsAsync(userId, cardId, status, ct);

        return list.Select(t => new TransactionDto
        {
            TransactionId = t.TransactionId,
            CardId = t.CardId,
            Type = t.Type,
            Amount = t.Amount,
            Currency = t.Currency,
            Merchant = t.Merchant,
            Description = t.Description,
            Status = t.Status,
            CreatedAtUtc = t.CreatedAtUtc
        }).ToList();
    }
}
