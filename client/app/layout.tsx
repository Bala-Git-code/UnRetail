import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Search, Store, LayoutDashboard, UserCheck, Shield, PlusCircle, Sparkles } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'UnRetail | Multi-Vendor Thrift & Circular Marketplace',
  description:
    'Bringing fragmented, offline thrift store inventories into a real-time, unified online marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Un<span className="text-emerald-400">Retail</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/feed"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" /> Discovery Feed
              </Link>
              <Link
                href="/search"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-slate-400" /> Search
              </Link>
              <Link
                href="/shops"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-slate-400" /> Shops
              </Link>
              <Link
                href="/orders"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" /> Orders
              </Link>
            </nav>

            {/* Action Buttons & Portal Switchers */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/new-item"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> List Item (60s)
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" /> Merchant
              </Link>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Admin
              </Link>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-300">UnRetail Monorepo Engine</span>
            </div>
            <p className="text-slate-400">
              Decentralized Circular Thrift Marketplace • Express + Prisma + Next.js App Router
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
