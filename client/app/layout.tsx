import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UnRetail | Multi-Vendor Thrift & Circular Fashion Marketplace',
  description:
    'Bringing fragmented, offline thrift store inventories into a real-time, unified online marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-400 selection:text-slate-950 font-sans border-slate-800">
        <div className="relative flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
