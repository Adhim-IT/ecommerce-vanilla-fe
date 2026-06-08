const API_URL = 'http://127.0.0.1:8000/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'API Error');
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}