namespace ErpAiReporting.Api.Models.Responses;

public record QueryResponse(
    string GeneratedSql,                          // Gemini'nin ürettiği SQL
    List<Dictionary<string, object?>> Results,    // Sorgu sonuçları
    string Insight,                               // Gemini'nin yorumu
    bool Success,
    string? ErrorMessage = null
);