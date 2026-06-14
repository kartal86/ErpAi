// results → [{company_name: "X", order_count: 31}, ...] gibi array
export default function ResultsTable({ results }) {
  if (!results || results.length === 0) return <p>Sonuç bulunamadı.</p>;

  // İlk objenin key'lerinden kolon başlıklarını otomatik üret
  // Hangi sorgu gelirse gelsin tablo kendini ayarlar
  const columns = Object.keys(results[0]);

  return (
    <div className="results-table">
      <h3>Sonuçlar ({results.length} kayıt)</h3>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{row[col] ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}