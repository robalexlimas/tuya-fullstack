namespace CreditCardApp.Application.DTOs.Auth;

public record AuthResponse(string AccessToken, UserDto User);

public record UserDto(string UserId, string Username, string Email);
