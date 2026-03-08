'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';

export default function SchoolsPage() {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) router.replace('/login');
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
      <h1>Schools</h1>
      <p>School list and drill-down (backend can add GET /v1/schools). Use Overview for daily report by date.</p>
    </div>
  );
}
