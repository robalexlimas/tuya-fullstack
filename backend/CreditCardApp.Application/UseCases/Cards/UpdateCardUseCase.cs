using CreditCardApp.Application.DTOs.Cards;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Cards;

public class UpdateCardUseCase
{
    private readonly ICardRepository _repo;
    public UpdateCardUseCase(ICardRepository repo) => _repo = repo;

    public async Task<CardDto> ExecuteAsync(string userId, string cardId, UpdateCardRequest req, CancellationToken ct)
    {
        if (req.ExpMonth < 1 || req.ExpMonth > 12)
            throw new ArgumentException("ExpMonth inválido.");

        var card = await _repo.UpdateAsync(userId, cardId, req.Brand, req.ExpMonth, req.ExpYear, req.Nickname, req.Status, ct);

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
