namespace ErpAiReporting.Api.Configuration;

// appsettings.json'daki "Gemini" bloğunu bu sınıfa map ediyoruz
// Avantaj: typo yaparsan compile time'da hata alırsın, runtime'da değil
public class GeminiOptions
{
    public const string SectionName = "Gemini";
    
    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gemini-1.5-flash";
    public string BaseUrl { get; set; } = string.Empty;
}