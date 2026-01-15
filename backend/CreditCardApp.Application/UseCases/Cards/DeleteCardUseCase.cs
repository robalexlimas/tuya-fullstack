using CreditCardApp.Application.DTOs.Cards;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Cards;

public class DeleteCardUseCase
{
    private readonly ICardRepository _repo;
    public DeleteCardUseCase(ICardRepository repo) => _repo = repo;

    public async Task<CardDto> ExecuteAsync(string userId, string cardId, CancellationToken ct)
    {
        var card = await _repo.CloseAsync(userId, cardId, ct);

        if (card is null)
            throw new KeyNotFoundException("Tarjeta no encontrada para este usuario.");

        return new CardDto
        {
            CardId = card.CardId,
            Brand = card.Brand,
            Last4 = card.Last4,
            ExpMonth = card.ExpMonth,
            ExpYear = card.ExpYear,
            CreditLimit = card.CreditLimit,
            AvailableCredit = card.AvailableCredit,
            Status = card.Status,
            Nickname = card.Nickname,
            CreatedAtUtc = card.CreatedAtUtc,
            UpdatedAtUtc = card.UpdatedAtUtc
        };
    }
}
