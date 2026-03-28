// frontend/cuisinecourier/src/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // only if your backend uses cookies
    headers: {
      // If your backend expects JSON:
      // "Content-Type": "application/json",
      // If you send an auth token:
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}