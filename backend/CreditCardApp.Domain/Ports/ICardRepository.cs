using CreditCardApp.Domain.Entities;

namespace CreditCardApp.Domain.Ports;

public interface ICardRepository
{
    Task<IReadOnlyList<Card>> GetByUserAsync(string userId, CancellationToken ct);
    Task<Card?> AddAsync(string userId, string brand, string last4, byte expMonth, short expYear, decimal creditLimit, string? nickname, CancellationToken ct);
    Task<Card?> UpdateAsync(string userId, string cardId, string brand, byte expMonth, short expYear, string? nickname, string status, CancellationToken ct);
    Task<Card?> CloseAsync(string userId, string cardId, CancellationToken ct);
}
