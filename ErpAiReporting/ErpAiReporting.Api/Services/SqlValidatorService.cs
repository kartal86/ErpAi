namespace ErpAiReporting.Api.Services;

// Neden bu servis var:
// Gemini bir SQL üretir, biz bunu direkt çalıştıramayız.
// Kötü niyetli veya hatalı bir prompt "DROP TABLE orders" üretebilir.
// Bu servis sadece SELECT sorgularına izin verir.
public class SqlValidatorService
{
    // Kesinlikle yasak kelimeler — bunlar veri değiştirir veya siler
    private static readonly string[] ForbiddenKeywords =
        ["DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE", "ALTER", "CREATE", "EXEC"];

    public ValidationResult Validate(string sql)
    {
        if (string.IsNullOrWhiteSpace(sql))
            return ValidationResult.Fail("SQL boş olamaz.");

        var upperSql = sql.ToUpperInvariant();

        // Sadece SELECT ile başlamalı
        if (!upperSql.TrimStart().StartsWith("SELECT"))
            return ValidationResult.Fail("Sadece SELECT sorguları desteklenmektedir.");

        // Yasak kelime var mı?
        foreach (var keyword in ForbiddenKeywords)
        {
            if (upperSql.Contains(keyword))
                return ValidationResult.Fail($"Güvenlik ihlali: '{keyword}' ifadesi kullanılamaz.");
        }

        return ValidationResult.Ok();
    }
}

// Sonuç nesnesi — bool + mesaj birlikte taşınıyor
public record ValidationResult(bool IsValid, string? Error)
{
    public static ValidationResult Ok() => new(true, null);
    public static ValidationResult Fail(string error) => new(false, error);
}