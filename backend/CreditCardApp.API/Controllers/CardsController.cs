using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CreditCardApp.Application.DTOs.Cards;
using CreditCardApp.Application.UseCases.Cards;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreditCardApp.API.Controllers;

[ApiController]
[Route("api/cards")]
[Authorize]
public class CardsController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CardDto>>> List(
        [FromServices] ListCardsUseCase useCase,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var cards = await useCase.ExecuteAsync(userId, ct);
        return Ok(cards);
    }

    [HttpPost]
    public async Task<ActionResult<CardDto>> Create(
        [FromServices] CreateCardUseCase useCase,
        [FromBody] CreateCardRequest req,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var card = await useCase.ExecuteAsync(userId, req, ct);
        return Ok(card);
    }

    [HttpPut("{cardId}")]
    public async Task<ActionResult<CardDto>> Update(
        [FromServices] UpdateCardUseCase useCase,
        [FromRoute] string cardId,
        [FromBody] UpdateCardRequest req,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var card = await useCase.ExecuteAsync(userId, cardId, req, ct);
        return Ok(card);
    }

    [HttpDelete("{cardId}")]
    public async Task<ActionResult<CardDto>> Delete(
        [FromServices] DeleteCardUseCase useCase,
        [FromRoute] string cardId,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var card = await useCase.ExecuteAsync(userId, cardId, ct);
        return Ok(card);
    }

    private static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue("uid")
               ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? throw new UnauthorizedAccessException("Token sin uid/sub.");
    }
}
