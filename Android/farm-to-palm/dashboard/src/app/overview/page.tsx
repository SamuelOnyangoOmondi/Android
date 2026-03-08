'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { getDailyReport, getTerminals } from '@/lib/api';

export default function OverviewPage() {
  const router = useRouter();
  const [daily, setDaily] = useState<{ date: string; attendance: number; meals: number } | null>(null);
  const [terminals, setTerminals] = useState<{ id: string; online: boolean }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    const today = new Date().toISOString().slice(0, 10);
    getDailyReport({ date: today }).then(setDaily).catch((e) => setError(e.message));
    getTerminals().then((r) => setTerminals(r.terminals)).catch(() => {});
  }, [router]);

  if (!getToken()) return null;

  const onlineCount = terminals.filter((t) => t.online).length;
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/overview" style={{ marginRight: 16 }}>Overview</Link>
        <Link href="/schools" style={{ marginRight: 16 }}>Schools</Link>
        <Link href="/terminals" style={{ marginRight: 16 }}>Terminals</Link>
        <Link href="/exports">Exports</Link>
      </nav>
      <h1>Overview</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <div style={{ padding: 24, background: 'white', borderRadius: 8, minWidth: 160, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#666' }}>Today attendance</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{daily?.attendance ?? '—'}</div>
        </div>
        <div style={{ padding: 24, background: 'white', borderRadius: 8, minWidth: 160, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#666' }}>Today meals</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{daily?.meals ?? '—'}</div>
        </div>
        <div style={{ padding: 24, background: 'white', borderRadius: 8, minWidth: 160, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#666' }}>Terminals online</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{onlineCount} / {terminals.length || '—'}</div>
        </div>
      </div>
    </div>
  );
}
