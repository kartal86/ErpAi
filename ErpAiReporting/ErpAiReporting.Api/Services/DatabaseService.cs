using System.Text.Json;
using Npgsql;

namespace ErpAiReporting.Api.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<List<Dictionary<string, object?>>> ExecuteQueryAsync(string sql){
    
        var results = new List<Dictionary<string, object?>>();
        
        int maxRetry = 3;
        int attempt = 0;
        
        while (attempt < maxRetry)
        {
            try
            {
                await using var conn = new NpgsqlConnection(_connectionString);
                await conn.OpenAsync();

                await using var cmd = new NpgsqlCommand(sql, conn);
                cmd.CommandTimeout = 30; // 15'ten 30'a çıkardık

                await using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object?>();
                    for (int i = 0; i < reader.FieldCount; i++)
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    results.Add(row);
                }
                
                return results; // Başarılıysa döndür
            }
            catch (NpgsqlException ex) when (ex.Message.Contains("timeout") || ex.Message.Contains("connection"))
            {
                attempt++;
                if (attempt >= maxRetry) throw; // 3 denemede de olmazsa hata fırlat
                await Task.Delay(1000 * attempt); // 1s, 2s bekle
            }
        }
        
        return results;
    }
}