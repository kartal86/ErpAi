namespace ErpAiReporting.Api.Models.Requests;

public record QueryRequest(
    string NaturalLanguageQuery  // "geçen ay en çok satan 5 ürün"
);