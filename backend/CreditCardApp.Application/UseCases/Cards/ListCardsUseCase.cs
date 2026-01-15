using CreditCardApp.Application.DTOs.Cards;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Cards;

public class ListCardsUseCase
{
    private readonly ICardRepository _repo;
    public ListCardsUseCase(ICardRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<CardDto>> ExecuteAsync(string userId, CancellationToken ct)
    {
        var cards = await _repo.GetByUserAsync(userId, ct);
        return cards.Select(c => new CardDto
        {
            CardId = c.CardId,
            Brand = c.Brand,
            Last4 = c.Last4,
            ExpMonth = c.ExpMonth,
            ExpYear = c.ExpYear,
            CreditLimit = c.CreditLimit,
            AvailableCredit = c.AvailableCredit,
            Status = c.Status,
            Nickname = c.Nickname,
            CreatedAtUtc = c.CreatedAtUtc,
            UpdatedAtUtc = c.UpdatedAtUtc
        }).ToList();
    }
}
