using System.Data;
using CreditCardApp.Domain.Entities;
using CreditCardApp.Domain.Ports;
using Dapper;
using MySqlConnector;

namespace CreditCardApp.Infrastructure.Persistence;

public class MySqlTransactionRepository : ITransactionRepository
{
    private readonly string _cs;
    public MySqlTransactionRepository(DbOptions options) => _cs = options.ConnectionString;
    private MySqlConnection Open() => new(_cs);

    public async Task<CardTransaction?> RecordPaymentAsync(string userId, string cardId, decimal amount, string? currency, string? description, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_CardId", cardId);
        p.Add("p_UserId", userId);
        p.Add("p_Amount", amount);
        p.Add("p_Currency", currency);
        p.Add("p_Description", description);

        // SP ya valida card pertenece al user (CardId AND UserId) y status ACTIVE
        return await conn.QueryFirstOrDefaultAsync<CardTransaction>(
            new CommandDefinition("sp_record_payment", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));
    }

    public async Task<IReadOnlyList<CardTransaction>> GetPaymentsByUserAsync(string userId, string? cardId, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_UserId", userId);
        p.Add("p_CardId", string.IsNullOrWhiteSpace(cardId) ? null : cardId);
        p.Add("p_Status", null);

        // sp_get_payments_by_user(p_UserId, p_CardId)
        var rows = await conn.QueryAsync<CardTransaction>(
            new CommandDefinition("sp_get_payments_by_user", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return rows.ToList();
    }

    public async Task<CardTransaction?> GetByIdAsync(string userId, string transactionId, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        // Query directa
        const string sql = @"
            SELECT
                CAST(TransactionId AS CHAR(36)) AS TransactionId,
                CAST(CardId AS CHAR(36)) AS CardId,
                CAST(UserId AS CHAR(36)) AS UserId,
                Type,
                Amount,
                Currency,
                Merchant,
                Description,
                Status,
                CreatedAtUtc
            FROM card_transactions
            WHERE TransactionId = @transactionId
              AND UserId = @userId
            LIMIT 1;";

        return await conn.QueryFirstOrDefaultAsync<CardTransaction>(
            new CommandDefinition(sql, new { transactionId, userId }, cancellationToken: ct));
    }

    public async Task<CardTransaction?> FinalizeAsync(string userId, string transactionId, string newStatus, CancellationToken ct)
    {
        // Seguridad: antes de finalizar verifica que sea del usuario
        var exists = await GetByIdAsync(userId, transactionId, ct);
        if (exists is null) return null;

        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_TransactionId", transactionId);
        p.Add("p_NewStatus", newStatus);

        var updated = await conn.QueryFirstOrDefaultAsync<CardTransaction>(
            new CommandDefinition("sp_finalize_transaction", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return updated;
    }

    public async Task<IReadOnlyList<CardTransaction>> GetTransactionsAsync(
    string userId,
    string? cardId,
    string? status,
    CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_UserId", userId);
        p.Add("p_CardId", string.IsNullOrWhiteSpace(cardId) ? null : cardId);
        p.Add("p_Status", string.IsNullOrWhiteSpace(status) ? null : status);

        var rows = await conn.QueryAsync<CardTransaction>(
            new CommandDefinition("sp_get_transactions", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return rows.ToList();
    }

    public async Task<IReadOnlyList<CardTransactionHistory>> GetTransactionHistoryAsync(
    string userId,
    string transactionId,
    CancellationToken ct)
    {
        // Verifica ownership
        var exists = await GetByIdAsync(userId, transactionId, ct);
        if (exists is null) return Array.Empty<CardTransactionHistory>();

        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_TransactionId", transactionId);

        var rows = await conn.QueryAsync<CardTransactionHistory>(
            new CommandDefinition("sp_get_transaction_history", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return rows.ToList();
    }

    public async Task<UserSummary?> GetUserSummaryAsync(string userId, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_UserId", userId);

        return await conn.QueryFirstOrDefaultAsync<UserSummary>(
            new CommandDefinition("sp_get_user_summary", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));
    }
}
