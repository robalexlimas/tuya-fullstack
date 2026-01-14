using System.Data;
using CreditCardApp.Domain.Entities;
using CreditCardApp.Domain.Ports;
using Dapper;
using MySqlConnector;

namespace CreditCardApp.Infrastructure.Persistence;

public class MySqlUserRepository : IUserRepository
{
    private readonly string _cs;
    public MySqlUserRepository(DbOptions options) => _cs = options.ConnectionString;

    private MySqlConnection Open() => new(_cs);

    public async Task<User?> CreateAsync(string username, string email, string passwordHash, string passwordSalt, CancellationToken ct)
    {
        await using var conn = Open();
        var p = new DynamicParameters();
        p.Add("p_Username", username);
        p.Add("p_Email", email);
        p.Add("p_PasswordHash", passwordHash);
        p.Add("p_PasswordSalt", passwordSalt);

        try
        {
            // Asegura apertura explícita (no siempre necesario, pero ayuda a diagnosticar)
            await conn.OpenAsync(ct);

            var created = await conn.QueryFirstOrDefaultAsync<User>(
                new CommandDefinition("sp_create_user", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

            return created;
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            // Duplicado: mejor lanzar excepción clara para mapear a 409
            throw new InvalidOperationException("El username o email ya existe.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB ERROR] {ex.GetType().Name}: {ex.Message}");
            throw;
        }
    }

    public async Task<UserAuthRecord?> GetForAuthByUsernameAsync(string username, CancellationToken ct)
    {
        using var conn = Open();
        var p = new DynamicParameters();
        p.Add("p_Username", username);
        p.Add("p_PasswordHash", "IGNORED"); // el SP no lo usa; lo dejamos por firma

        var record = await conn.QueryFirstOrDefaultAsync<UserAuthRecord>(
            new CommandDefinition("sp_authenticate_user", p, commandType: CommandType.StoredProcedure, cancellationToken: ct));

        return record;
    }

    public async Task<User?> GetByIdAsync(string userId, CancellationToken ct)
    {
        await using var conn = Open();

        const string sql = @"
        SELECT
            CAST(UserId AS CHAR(36)) AS UserId,
            Username,
            Email,
            IsActive,
            CreatedAtUtc
        FROM users
        WHERE UserId = @userId
        LIMIT 1;";

        return await conn.QueryFirstOrDefaultAsync<User>(
            new CommandDefinition(sql, new { userId }, cancellationToken: ct));
    }
}
