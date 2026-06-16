const API_URL = import.meta.env.VITE_API_URL;

export async function queryDatabase(naturalLanguageQuery) {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ naturalLanguageQuery }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || "Bir hata oluştu");
  }

  return response.json();
}