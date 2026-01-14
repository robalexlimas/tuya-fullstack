using Microsoft.AspNetCore.Mvc;

namespace CreditCardApp.API.Controllers;

[ApiController]
[Route("healthy")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        var response = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0",
            Service = "CreditCardApp API"
        };

        return Ok(response);
    }
}
