using CreditCardApp.Application.DTOs.Transactions;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Transactions;

public class GetUserSummaryUseCase
{
    private readonly ITransactionRepository _repo;
    public GetUserSummaryUseCase(ITransactionRepository repo) => _repo = repo;

    public async Task<UserSummaryDto> ExecuteAsync(string userId, CancellationToken ct)
    {
        var s = await _repo.GetUserSummaryAsync(userId, ct)
                ?? throw new InvalidOperationException("No se pudo obtener el resumen.");

        return new UserSummaryDto
        {
            TotalPayments = s.TotalPayments,
            TotalPurchases = s.TotalPurchases,
            TotalRefunds = s.TotalRefunds,
            TotalPaymentsAmount = s.TotalPaymentsAmount,
            TotalPurchasesAmount = s.TotalPurchasesAmount,
            TotalRefundsAmount = s.TotalRefundsAmount
        };
    }
}
