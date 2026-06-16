using Npgsql;

namespace ErpAiReporting.Api.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
        // Pool'u tamamen kapat — Supabase free tier pool yönetimini kendisi yapıyor
        NpgsqlConnection.ClearAllPools();
    }

    public async Task<List<Dictionary<string, object?>>> ExecuteQueryAsync(string sql)
    {
        var results = new List<Dictionary<string, object?>>();

        // Her sorguda temiz bağlantı aç, bitince kapat
        // Pool disable ettiğimiz için overhead yok
        var connString = _connectionString + ";No Reset On Close=true;Pooling=false";
        
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.CommandTimeout = 30;

        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var row = new Dictionary<string, object?>();
            for (int i = 0; i < reader.FieldCount; i++)
                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
            results.Add(row);
        }

        return results;
    }
}