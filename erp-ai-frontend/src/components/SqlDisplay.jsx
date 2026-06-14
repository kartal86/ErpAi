// sql prop'u string olarak gelir
export default function SqlDisplay({ sql }) {
  if (!sql) return null; // SQL yoksa hiçbir şey render etme

  return (
    <div className="sql-display">
      <h3>Üretilen SQL</h3>
      <pre>{sql}</pre> {/* pre etiketi boşlukları korur */}
    </div>
  );
}