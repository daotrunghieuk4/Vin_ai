const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => apiFetch<{ status: string; database: string }>('/health'),
  createQuote: <T>(payload: T) => apiFetch('/api/quotes', { method: 'POST', body: JSON.stringify(payload) }),
  createBooking: <T>(payload: T) => apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
};

