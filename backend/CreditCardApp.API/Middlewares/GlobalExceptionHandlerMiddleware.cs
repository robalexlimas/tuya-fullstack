using System.Net;
using System.Text.Json;
using MySqlConnector;

namespace CreditCardApp.API.Middlewares;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Error no controlado: {Message}", exception.Message);

        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ErrorResponse();

        switch (exception)
        {
            case InvalidOperationException invalidOpEx:
                response.StatusCode = (int)HttpStatusCode.Conflict;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = invalidOpEx.Message;
                errorResponse.Type = "ConflictError";
                break;

            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = "No tiene autorización para acceder a este recurso";
                errorResponse.Type = "UnauthorizedError";
                break;

            case ArgumentException argEx:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = argEx.Message;
                errorResponse.Type = "ValidationError";
                break;

            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = "El recurso solicitado no fue encontrado";
                errorResponse.Type = "NotFoundError";
                break;

            case MySqlException mysqlEx:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = "Error en la base de datos";
                errorResponse.Type = "DatabaseError";
                errorResponse.Details = mysqlEx.Message;
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.StatusCode = response.StatusCode;
                errorResponse.Message = "Ocurrió un error interno en el servidor";
                errorResponse.Type = "InternalServerError";
                errorResponse.Details = exception.Message;
                break;
        }

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var result = JsonSerializer.Serialize(errorResponse, jsonOptions);
        await response.WriteAsync(result);
    }
}

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
