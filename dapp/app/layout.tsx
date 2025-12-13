import '../styles/tailwind.css';
import type { ReactNode } from 'react';

import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <nav className="w-full flex gap-4 p-4 bg-white shadow mb-6">
          <Link href="/upload" className="font-semibold hover:underline">Upload & Sign</Link>
          <Link href="/verify" className="font-semibold hover:underline">Verify</Link>
          <Link href="/history" className="font-semibold hover:underline">History</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
