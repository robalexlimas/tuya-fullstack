namespace CreditCardApp.Domain.Ports;

public interface ITokenService
{
    string CreateAccessToken(string userId, string username, string email);
}
