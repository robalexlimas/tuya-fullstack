using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CreditCardApp.Application.DTOs.Payments;
using CreditCardApp.Application.UseCases.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreditCardApp.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PaymentDto>> Create(
        [FromServices] CreatePaymentUseCase useCase,
        [FromBody] CreatePaymentRequest req,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var payment = await useCase.ExecuteAsync(userId, req, ct);
        return Ok(payment);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PaymentDto>>> List(
        [FromServices] ListPaymentsUseCase useCase,
        [FromQuery] string? cardId,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var list = await useCase.ExecuteAsync(userId, cardId, ct);
        return Ok(list);
    }

    [HttpGet("{transactionId}")]
    public async Task<ActionResult<PaymentDto>> Get(
        [FromServices] GetPaymentUseCase useCase,
        [FromRoute] string transactionId,
        CancellationToken ct)
    {
        var userId = GetUserId(User);
        var payment = await useCase.ExecuteAsync(userId, transactionId, ct);
        return Ok(payment);
    }

    private static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue("uid")
               ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? throw new UnauthorizedAccessException("Token sin uid/sub.");
    }
}
