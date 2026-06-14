import { useState } from "react";
import QueryInput from "./components/QueryInput";
import SqlDisplay from "./components/SqlDisplay";
import ResultsTable from "./components/ResultsTable";
import ResultsChart from "./components/ResultsChart";
import InsightBox from "./components/InsightBox";
import { queryDatabase } from "./services/api";
import "./App.css";

export default function App() {
  // Tüm uygulama state'i burada — child component'lar props ile alır
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleQuery(query) {
    setIsLoading(true);
    setError(null);
    setResult(null); // Önceki sonucu temizle

    try {
      const data = await queryDatabase(query);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Her durumda loading'i kapat
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🗄️ ERP AI Raporlama</h1>
        <p>Doğal dille veritabanınızı sorgulayın</p>
      </header>

      <main>
        <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

        {/* Hata varsa göster */}
        {error && <div className="error-box">❌ {error}</div>}

        {/* Sonuç varsa göster */}
        {result && (
          <>
            <SqlDisplay sql={result.generatedSql} />
            <ResultsChart results={result.results} />
            <ResultsTable results={result.results} />
            <InsightBox insight={result.insight} />
          </>
        )}
      </main>
    </div>
  );
}