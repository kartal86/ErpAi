using System.Text;
using System.Text.Json;
using ErpAiReporting.Api.Configuration;
using Microsoft.Extensions.Options;

namespace ErpAiReporting.Api.Services;

public class GeminiService
{
    private readonly HttpClient _http;
    private readonly GeminiOptions _options;

    private const string NorthwindSchema = """
        PostgreSQL veritabanı. Tablolar:
        - customers (customer_id, company_name, contact_name, city, country)
        - orders (order_id, customer_id, employee_id, order_date, shipped_date, freight)
        - order_details (order_id, product_id, unit_price, quantity, discount)
        - products (product_id, product_name, supplier_id, category_id, unit_price, units_in_stock)
        - categories (category_id, category_name, description)
        - employees (employee_id, first_name, last_name, title, city, country)
        - suppliers (supplier_id, company_name, city, country)
        """;

    public GeminiService(HttpClient http, IOptions<GeminiOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<string> GenerateSqlAsync(string naturalLanguageQuery)
    {
        var systemPrompt = $"""
            Sen bir PostgreSQL uzmanısın.
            Kullanıcının doğal dil sorgusunu PostgreSQL sorgusuna çevir.
            
            {NorthwindSchema}
            
            Kurallar:
            - SADECE SELECT sorgusu yaz, başka hiçbir şey yazma
            - Açıklama, yorum, markdown kod bloğu ekleme
            - ``` veya ```sql gibi işaretler kullanma
            - Sadece düz SQL kodunu döndür, ilk karakter SELECT olmalı
            - PostgreSQL syntax kullan (LIMIT, NOW(), COALESCE vs.)
            """;

        var sql = await CallGeminiAsync(naturalLanguageQuery, systemPrompt);
        return CleanSql(sql);
    }

    public async Task<string> GenerateInsightAsync(
        string originalQuery,
        string sql,
        string resultsJson)
    {
        var prompt = $"""
            Kullanıcı şunu sordu: "{originalQuery}"
            SQL sorgusu: {sql}
            Sonuçlar: {resultsJson}
            
            Bu sonuçları 2 cümleyle Türkçe yorumla. Sadece önemli bulguyu söyle.
            """;

        return await CallGeminiAsync(prompt, "Sen bir iş analisti asistanısın. Kısa ve net cevaplar ver.");
    }

    private async Task<string> CallGeminiAsync(string userMessage, string systemPrompt)
    {
        var url = $"{_options.BaseUrl}/{_options.Model}:generateContent?key={_options.ApiKey}";

        var requestBody = new
        {
            system_instruction = new
            {
                parts = new[] { new { text = systemPrompt } }
            },
            contents = new[]
            {
                new { parts = new[] { new { text = userMessage } } }
            },
            generationConfig = new
            {
                temperature = 0.1,
                maxOutputTokens = 1024
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _http.PostAsync(url, content);

        // Hata durumunda detaylı mesaj göster
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Gemini API hatası [{response.StatusCode}]: {errorBody}");
        }

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();

        return result
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "";
    }

    // Gemini bazen kurallara rağmen markdown döndürür
    // Bu metod her durumda temiz SQL döndürür
    private static string CleanSql(string sql)
    {
        return sql
            .Replace("```sql", "")
            .Replace("```", "")
            .Trim();
    }
}