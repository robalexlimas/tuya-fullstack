using CreditCardApp.Domain.Entities;

namespace CreditCardApp.Domain.Ports;

public interface IUserRepository
{
    Task<User?> CreateAsync(string username, string email, string passwordHash, string passwordSalt, CancellationToken ct);
    Task<UserAuthRecord?> GetForAuthByUsernameAsync(string username, CancellationToken ct);
    Task<User?> GetByIdAsync(string userId, CancellationToken ct);
}
