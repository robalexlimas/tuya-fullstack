using CreditCardApp.Application.DTOs.Cards;
using CreditCardApp.Domain.Ports;

namespace CreditCardApp.Application.UseCases.Cards;

public class CreateCardUseCase
{
    private readonly ICardRepository _repo;
    public CreateCardUseCase(ICardRepository repo) => _repo = repo;

    public async Task<CardDto> ExecuteAsync(string userId, CreateCardRequest req, CancellationToken ct)
    {
        if (req.Last4?.Length != 4)
            throw new ArgumentException("Last4 debe tener 4 dígitos.");

        if (req.ExpMonth < 1 || req.ExpMonth > 12)
            throw new ArgumentException("ExpMonth inválido.");

        if (req.CreditLimit < 0)
            throw new ArgumentException("CreditLimit inválido.");

        var card = await _repo.AddAsync(userId, req.Brand, req.Last4, req.ExpMonth, req.ExpYear, req.CreditLimit, req.Nickname, ct)
                   ?? throw new InvalidOperationException("No se pudo crear la tarjeta.");

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
