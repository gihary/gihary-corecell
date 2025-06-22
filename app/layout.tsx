import '../styles/globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans">
        <main className="max-w-xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
