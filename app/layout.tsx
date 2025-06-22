import '../styles/globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans">
        <AuthProvider>
          <main className="max-w-xl mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
