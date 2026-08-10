import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unretail | Multi-Vendor Thrift & Vintage Marketplace',
  description:
    'Discover unique pre-loved fashion, rare vintage finds, and sustainable local thrift shops in one unified marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
