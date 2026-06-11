using System.Text.Json;
using ErpAiReporting.Api.Models.Requests;
using ErpAiReporting.Api.Models.Responses;
using ErpAiReporting.Api.Services;

namespace ErpAiReporting.Api.Endpoints;

// Neden ayrı dosya: Tüm endpoint'leri Program.cs'e yazmak
// proje büyüdükçe okunaksız hale gelir.
// Her domain'in kendi endpoint dosyası olur.
public static class ReportEndpoints
{
    public static void MapReportEndpoints(this WebApplication app)
    {
        app.MapPost("/api/query", async (
            QueryRequest request,
            GeminiService gemini,
            DatabaseService db,
            SqlValidatorService validator) =>
        {
            // Adım 1: Doğal dil → SQL
            var sql = await gemini.GenerateSqlAsync(request.NaturalLanguageQuery);
            Console.WriteLine("1- Gemini SQL üretti");
            Console.WriteLine(sql);
            // Adım 2: SQL'i doğrula
            var validation = validator.Validate(sql);
            Console.WriteLine("2- Validation geçti mi?");
            Console.WriteLine(validation.IsValid);
            if (!validation.IsValid)
                return Results.BadRequest(new QueryResponse(sql, [], "", false, validation.Error));

            // Adım 3: PostgreSQL'de çalıştır
            List<Dictionary<string, object?>> results;
            try
            {
                results = await db.ExecuteQueryAsync(sql);
                Console.WriteLine("3- SQL çalıştı");
                Console.WriteLine($"Satır sayısı: {results.Count}");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new QueryResponse(sql, [], "", false, $"Sorgu hatası: {ex.Message}"));
            }

            // Adım 4: Sonucu yorumla
            var resultsJson = JsonSerializer.Serialize(results.Take(10)); // İlk 10 satır yeterli
            var insight = await gemini.GenerateInsightAsync(
                request.NaturalLanguageQuery, sql, resultsJson);
            Console.WriteLine("4- Insight üretildi");
            return Results.Ok(new QueryResponse(sql, results, insight, true));
        });
    }
}