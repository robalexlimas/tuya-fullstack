using System.Data;
using CreditCardApp.Domain.Entities;
using CreditCardApp.Domain.Ports;
using Dapper;
using MySqlConnector;

namespace CreditCardApp.Infrastructure.Persistence;

public class MySqlCardRepository : ICardRepository
{
    private readonly string _cs;
    public MySqlCardRepository(DbOptions options) => _cs = options.ConnectionString;
    private MySqlConnection Open() => new(_cs);

    public async Task<IReadOnlyList<Card>> GetByUserAsync(string userId, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_UserId", userId);

        var rows = await conn.QueryAsync<Card>(
            new CommandDefinition("sp_get_cards_by_user", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return rows.ToList();
    }

    public async Task<Card?> AddAsync(string userId, string brand, string last4, byte expMonth, short expYear, decimal creditLimit, string? nickname, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_UserId", userId);
        p.Add("p_Brand", brand);
        p.Add("p_Last4", last4);
        p.Add("p_ExpMonth", expMonth);
        p.Add("p_ExpYear", expYear);
        p.Add("p_CreditLimit", creditLimit);
        p.Add("p_Nickname", nickname);

        return await conn.QueryFirstOrDefaultAsync<Card>(
            new CommandDefinition("sp_add_card", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));
    }

    public async Task<Card?> UpdateAsync(string userId, string cardId, string brand, byte expMonth, short expYear, string? nickname, string status, CancellationToken ct)
    {
        // Seguridad: verifica pertenencia antes de update
        var owned = await GetOwnedAsync(userId, cardId, ct);
        if (!owned) return null;

        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_CardId", cardId);
        p.Add("p_Brand", brand);
        p.Add("p_ExpMonth", expMonth);
        p.Add("p_ExpYear", expYear);
        p.Add("p_Nickname", nickname);
        p.Add("p_Status", status);

        return await conn.QueryFirstOrDefaultAsync<Card>(
            new CommandDefinition("sp_update_card", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));
    }

    public async Task<Card?> CloseAsync(string userId, string cardId, CancellationToken ct)
    {
        // Seguridad: verifica pertenencia antes de cerrar
        var owned = await GetOwnedAsync(userId, cardId, ct);
        if (!owned) return null;

        await using var conn = Open();
        await conn.OpenAsync(ct);

        var p = new DynamicParameters();
        p.Add("p_CardId", cardId);

        return await conn.QueryFirstOrDefaultAsync<Card>(
            new CommandDefinition("sp_close_card", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));
    }

    private async Task<bool> GetOwnedAsync(string userId, string cardId, CancellationToken ct)
    {
        await using var conn = Open();
        await conn.OpenAsync(ct);

        const string sql = @"
            SELECT 1
            FROM cards
            WHERE CardId = @cardId AND UserId = @userId
            LIMIT 1;";

        var exists = await conn.QueryFirstOrDefaultAsync<int?>(
            new CommandDefinition(sql, new { cardId, userId }, cancellationToken: ct));

        return exists.HasValue;
    }
}
