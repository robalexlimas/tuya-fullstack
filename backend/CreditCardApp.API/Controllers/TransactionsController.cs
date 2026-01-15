using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Application.UseCases.Payments;
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

    private static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue("uid")
               ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? throw new UnauthorizedAccessException("Token sin uid/sub.");
    }
}
