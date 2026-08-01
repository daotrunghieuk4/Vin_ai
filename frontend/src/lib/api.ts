const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('vinfast_token');
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'API request failed' }));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function formatVNDPrice(price: number): string {
  if (!price || price <= 0) return 'Liên hệ';
  let vnd = price;
  if (vnd < 10000) {
    vnd = vnd * 1000000;
  }
  if (vnd >= 1_000_000_000) {
    const ty = vnd / 1_000_000_000;
    const formatted = ty.toLocaleString('vi-VN', { maximumFractionDigits: 3 });
    return `${formatted} tỷ VNĐ`;
  }
  const trieu = vnd / 1_000_000;
  return `${trieu.toLocaleString('vi-VN')} triệu VNĐ`;
}

export const api = {
  health: () => apiFetch<{ status: string; database: string }>('/health'),
  
  // Auth & Admin User Management APIs
  register: <T>(payload: any) => apiFetch<T>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: <T>(payload: any) => apiFetch<T>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: <T>() => apiFetch<T>('/api/auth/me'),
  getUsers: <T>() => apiFetch<T>('/api/auth/users'),
  createStaff: <T>(payload: any) => apiFetch<T>('/api/auth/create-staff', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: <T>(id: string, payload: any) => apiFetch<T>(`/api/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: <T>(id: string) => apiFetch<T>(`/api/auth/users/${id}`, { method: 'DELETE' }),


  // Cars Catalog & Specs APIs
  getCars: <T>(category?: string) => apiFetch<T>(`/api/cars${category ? `?category=${category}` : ''}`),
  getCarDetail: <T>(idOrCode: string) => apiFetch<T>(`/api/cars/${idOrCode}`),
  createCar: <T>(formData: FormData) => apiFetch<T>('/api/cars', { method: 'POST', body: formData }),
  updateCar: <T>(id: string, body: any) => apiFetch<T>(`/api/cars/${id}`, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  deleteCar: <T>(id: string) => apiFetch<T>(`/api/cars/${id}`, { method: 'DELETE' }),

  // E-Scooters Catalog APIs
  getEScooters: <T>(category?: string) => apiFetch<T>(`/api/escooters${category ? `?category=${category}` : ''}`),
  createEScooter: <T>(formData: FormData) => apiFetch<T>('/api/escooters', { method: 'POST', body: formData }),
  updateEScooter: <T>(id: string, body: any) => apiFetch<T>(`/api/escooters/${id}`, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  deleteEScooter: <T>(id: string) => apiFetch<T>(`/api/escooters/${id}`, { method: 'DELETE' }),

  // Quotes & Bookings
  createQuote: <T>(payload: T) => apiFetch<T>('/api/quotes', { method: 'POST', body: JSON.stringify(payload) }),
  getQuotes: <T>() => apiFetch<T>('/api/quotes'),
  updateQuoteStatus: <T>(id: string, payload: any) => apiFetch<T>(`/api/quotes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  createBooking: <T>(payload: T) => apiFetch<T>('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  getBookings: <T>() => apiFetch<T>('/api/bookings'),
  updateBookingStatus: <T>(id: string, payload: any) => apiFetch<T>(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};



