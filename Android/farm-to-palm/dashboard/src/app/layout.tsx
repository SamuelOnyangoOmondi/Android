import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FarmToPalm Dashboard',
  description: 'Attendance & meal visibility',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
