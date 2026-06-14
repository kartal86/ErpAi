// Props olarak iki şey alıyor:
// onSubmit → kullanıcı "Sorgula" basınca App.jsx'e haber ver
// isLoading → yüklenirken butonu disable et
export default function QueryInput({ onSubmit, isLoading }) {
  // Bu component'ın kendi state'i — sadece input değerini tutar
  const [query, setQuery] = useState("");

  function handleSubmit() {
    if (!query.trim()) return; // Boş sorgu gönderme
    onSubmit(query);
  }

  // Enter'a basınca da çalışsın
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="query-input">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Örnek: En çok sipariş veren 5 müşteriyi getir"
        disabled={isLoading}
      />
      <button onClick={handleSubmit} disabled={isLoading || !query.trim()}>
        {isLoading ? "Sorgulanıyor..." : "Sorgula"}
      </button>
    </div>
  );
}

// useState'i import etmeyi unutma
import { useState } from "react";