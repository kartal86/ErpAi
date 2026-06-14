import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ResultsChart({ results }) {
  if (!results || results.length === 0) return null;

  const columns = Object.keys(results[0]);
  
  // Sayısal kolon bul — grafik için bu lazım
  const numericCol = columns.find((col) => typeof results[0][col] === "number");
  // Metin kolonu bul — X ekseni için
  const labelCol = columns.find((col) => typeof results[0][col] === "string");

  // Sayısal kolon yoksa grafik gösterme — anlamsız olur
  if (!numericCol || !labelCol) return null;

  return (
    <div className="results-chart">
      <h3>Grafik</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results}>
          <XAxis 
            dataKey={labelCol} 
            tick={{ fontSize: 12 }}
            // Uzun isimler için kısalt
            tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + "..." : val}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey={numericCol} fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}