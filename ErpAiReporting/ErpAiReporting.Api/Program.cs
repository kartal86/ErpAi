using ErpAiReporting.Api.Configuration;
using ErpAiReporting.Api.Endpoints;
using ErpAiReporting.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Config'i typed class'a bağla
builder.Services.Configure<GeminiOptions>(
    builder.Configuration.GetSection(GeminiOptions.SectionName));

// 2. Servisleri DI container'a kaydet
// AddHttpClient → HttpClient'ı doğru şekilde yönetir (socket exhaustion önler)
builder.Services.AddHttpClient<GeminiService>();
builder.Services.AddScoped<DatabaseService>();
builder.Services.AddSingleton<SqlValidatorService>();

// 3. CORS — React localhost:5173'ten istek atacak
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

// 4. Endpoint'leri bağla
app.MapReportEndpoints();

app.Run();