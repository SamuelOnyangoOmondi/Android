'use client';

export function setToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('farmtopalm_token', token);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('farmtopalm_token');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('farmtopalm_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
