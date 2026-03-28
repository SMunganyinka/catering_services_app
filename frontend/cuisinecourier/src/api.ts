// frontend/cuisinecourier/src/api.ts

// Define the base URL
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to get headers with Auth token
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token: string | null = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Generic GET request
export async function apiGet(path: string): Promise<any> {
  const res: Response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const error: any = new Error(`API error: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// Generic POST request
export async function apiPost(path: string, data: any): Promise<any> {
  const res: Response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: any = new Error(`API error: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// Export the URL constant for use in AuthView
export { API_BASE_URL };