'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { getTerminals } from '@/lib/api';

export default function TerminalsPage() {
  const router = useRouter();
  const [list, setList] = useState<Array<{ id: string; school_id: string; last_heartbeat_at: string | null; online: boolean }>>([]);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    getTerminals().then((r) => setList(r.terminals)).catch(() => {});
  }, [router]);

  if (!getToken()) return null;
  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/overview" style={{ marginRight: 16 }}>Overview</Link>
        <Link href="/schools" style={{ marginRight: 16 }}>Schools</Link>
        <Link href="/terminals" style={{ marginRight: 16 }}>Terminals</Link>
        <Link href="/exports">Exports</Link>
      </nav>
      <h1>Terminals</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
            <th style={{ textAlign: 'left', padding: 12 }}>School</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Last heartbeat</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 12 }}>{t.id}</td>
              <td style={{ padding: 12 }}>{t.school_id}</td>
              <td style={{ padding: 12 }}>{t.last_heartbeat_at ? new Date(t.last_heartbeat_at).toLocaleString() : '—'}</td>
              <td style={{ padding: 12 }}>{t.online ? 'Online' : 'Offline'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <p>No terminals.</p>}
    </div>
  );
}
