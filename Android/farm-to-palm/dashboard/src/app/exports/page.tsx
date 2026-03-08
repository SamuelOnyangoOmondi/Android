'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { api } from '@/lib/api';

export default function ExportsPage() {
  const router = useRouter();
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!getToken()) router.replace('/login');
  }, [router]);

  async function downloadCsv() {
    const q = `from=${from}&to=${to}`;
    const csv = await api<string>(`/v1/exports/events.csv?${q}`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!getToken()) return null;

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/overview" style={{ marginRight: 16 }}>Overview</Link>
        <Link href="/schools" style={{ marginRight: 16 }}>Schools</Link>
        <Link href="/terminals" style={{ marginRight: 16 }}>Terminals</Link>
        <Link href="/exports">Exports</Link>
      </nav>
      <h1>Export events (CSV)</h1>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 16 }}>
        <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ marginLeft: 8, padding: 4 }} /></label>
        <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ marginLeft: 8, padding: 4 }} /></label>
        <button type="button" onClick={downloadCsv} style={{ padding: 8, background: '#1976D2', color: 'white', border: 'none', borderRadius: 4 }}>Download CSV</button>
      </div>
      <p style={{ color: '#666', marginTop: 16 }}>CSV includes attendance and meal events.</p>
    </div>
  );
}
