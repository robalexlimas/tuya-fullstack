using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Application.UseCases.Payments;
using CreditCardApp.Application.UseCases.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreditCardApp.API.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    [HttpPut("{transactionId}/status")]
    public async Task<ActionResult<PaymentDto>> Finalize(
        [FromServices] FinalizeTransactionUseCase useCase,
        [FromRoute] string transactionId,
        [FromBody] UpdateTransactionStatusRequest req,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var updated = await useCase.ExecuteAsync(userId, transactionId, req, ct);
        return Ok(updated);
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromServices] ListTransactionsUseCase useCase,
        [FromQuery] string? cardId,
        [FromQuery] string? status,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var list = await useCase.ExecuteAsync(userId, cardId, status, ct);
        return Ok(list);
    }

    [HttpGet("{transactionId}/history")]
    public async Task<IActionResult> History(
        [FromServices] GetTransactionHistoryUseCase useCase,
        [FromRoute] string transactionId,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var history = await useCase.ExecuteAsync(userId, transactionId, ct);
        return Ok(history);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> Summary(
        [FromServices] GetUserSummaryUseCase useCase,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var summary = await useCase.ExecuteAsync(userId, ct);
        return Ok(summary);
    }

    private static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue("uid")
               ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? throw new UnauthorizedAccessException("Token sin uid/sub.");
    }
}
