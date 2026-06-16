using ErpAiReporting.Api.Configuration;
using ErpAiReporting.Api.Endpoints;
using ErpAiReporting.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Swagger servisleri
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Config
builder.Services.Configure<GeminiOptions>(
    builder.Configuration.GetSection(GeminiOptions.SectionName));

// 3. DI
builder.Services.AddHttpClient<GeminiService>();
builder.Services.AddScoped<DatabaseService>();
builder.Services.AddSingleton<SqlValidatorService>();

// 4. CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "https://erp-ai-tau.vercel.app"  
        )
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// 5. Swagger middleware (KRİTİK)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ERP AI Reporting API V1");
    c.RoutePrefix = "swagger"; // /swagger URL’i
});

// 6. CORS
app.UseCors();

// 7. Endpoints
app.MapReportEndpoints();

// 8. Root test endpoint (önerilir)
app.MapGet("/", () => "ERP AI API running 🚀");

app.Run();