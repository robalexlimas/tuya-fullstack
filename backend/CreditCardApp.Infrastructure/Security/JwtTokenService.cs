using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CreditCardApp.Domain.Ports;
using Microsoft.IdentityModel.Tokens;

namespace CreditCardApp.Infrastructure.Security;

public class JwtTokenService : ITokenService
{
    private readonly JwtOptions _opt;
    public JwtTokenService(JwtOptions opt) => _opt = opt;

    public string CreateAccessToken(string userId, string username, string email)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.UniqueName, username),
            new(JwtRegisteredClaimNames.Email, email),
            new("uid", userId),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _opt.Issuer,
            audience: _opt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_opt.ExpMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
