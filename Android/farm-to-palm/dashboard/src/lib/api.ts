const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('farmtopalm_token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  if (res.headers.get('content-type')?.includes('application/json')) return res.json();
  return res.text() as unknown as T;
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  return api('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getDailyReport(params: { schoolId?: string; date: string }) {
  const q = new URLSearchParams();
  if (params.schoolId) q.set('schoolId', params.schoolId);
  q.set('date', params.date);
  return api<{ date: string; attendance: number; meals: number }>(`/v1/reports/daily?${q}`);
}

export async function getTrends(params: { schoolId?: string; from: string; to: string }) {
  const q = new URLSearchParams();
  if (params.schoolId) q.set('schoolId', params.schoolId);
  q.set('from', params.from);
  q.set('to', params.to);
  return api<{ attendance: Array<{ day: string; c: string }>; meals: Array<{ day: string; c: string }> }>(`/v1/reports/trends?${q}`);
}

export async function getExceptions(params: { schoolId?: string; date: string }) {
  const q = new URLSearchParams();
  if (params.schoolId) q.set('schoolId', params.schoolId);
  q.set('date', params.date);
  return api<{ exceptions: unknown[] }>(`/v1/reports/exceptions?${q}`);
}

export async function getTerminals(params?: { schoolId?: string }) {
  const q = params?.schoolId ? `?schoolId=${params.schoolId}` : '';
  return api<{ terminals: Array<{ id: string; school_id: string; last_heartbeat_at: string | null; online: boolean }> }>(`/v1/reports/terminals${q}`);
}

export function getExportCsvUrl(params: { schoolId?: string; from: string; to: string }): string {
  const q = new URLSearchParams();
  if (params.schoolId) q.set('schoolId', params.schoolId);
  q.set('from', params.from);
  q.set('to', params.to);
  const token = getToken();
  return `${API_URL}/v1/exports/events.csv?${q}` + (token ? `&token=${encodeURIComponent(token)}` : '');
}
