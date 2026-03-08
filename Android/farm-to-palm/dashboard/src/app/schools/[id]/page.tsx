'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { getDailyReport, getTrends, getExceptions } from '@/lib/api';

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [daily, setDaily] = useState<{ attendance: number; meals: number } | null>(null);
  const [exceptions, setExceptions] = useState<unknown[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    getDailyReport({ schoolId: id, date: today }).then(setDaily).catch(() => {});
    getExceptions({ schoolId: id, date: today }).then((r) => setExceptions(r.exceptions)).catch(() => {});
  }, [id, router]);

  if (!getToken()) return null;
  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/overview" style={{ marginRight: 16 }}>Overview</Link>
        <Link href="/schools" style={{ marginRight: 16 }}>Schools</Link>
        <Link href="/terminals" style={{ marginRight: 16 }}>Terminals</Link>
        <Link href="/exports">Exports</Link>
      </nav>
      <h1>School {id}</h1>
      <p>Daily: Attendance {daily?.attendance ?? '—'}, Meals {daily?.meals ?? '—'}</p>
      <p>Exceptions today: {exceptions.length}</p>
    </div>
  );
}
