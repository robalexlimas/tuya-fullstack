using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CreditCardApp.Application.DTOs.Auth;
using CreditCardApp.Application.UseCases.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreditCardApp.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromServices] RegisterUserUseCase useCase,
        [FromBody] RegisterRequest request,
        CancellationToken ct)
    {
        var result = await useCase.ExecuteAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromServices] LoginUseCase useCase,
        [FromBody] LoginRequest request,
        CancellationToken ct)
    {
        var result = await useCase.ExecuteAsync(request, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDto>> Me(
        [FromServices] GetMeUseCase useCase,
        CancellationToken ct)
    {
        var userId = GetUserIdFromClaims(User);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "Token inválido o sin claim de usuario." });

        var me = await useCase.ExecuteAsync(userId, ct);
        return Ok(me);
    }

    private static string? GetUserIdFromClaims(ClaimsPrincipal user)
    {
        // En JwtTokenService pusimos: claim "uid" y también sub.
        return user.FindFirstValue("uid")
               ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
