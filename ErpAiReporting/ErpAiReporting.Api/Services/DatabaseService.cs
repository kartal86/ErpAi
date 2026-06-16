using Npgsql;

namespace ErpAiReporting.Api.Services;

public class DatabaseService
{
    private readonly NpgsqlDataSource _dataSource;

    public DatabaseService(IConfiguration config)
    {
        var connectionString = config.GetConnectionString("DefaultConnection")!;
        
        // NpgsqlDataSource — bağlantıları doğru yönetir, her seferinde yeni bağlantı açmaz
        var builder = new NpgsqlDataSourceBuilder(connectionString);
        _dataSource = builder.Build();
    }

    public async Task<List<Dictionary<string, object?>>> ExecuteQueryAsync(string sql)
    {
        var results = new List<Dictionary<string, object?>>();

        await using var conn = await _dataSource.OpenConnectionAsync();
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