'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ShieldCheck, Activity, DollarSign, Store, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* High-Contrast Executive Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        {/* Top Health Status Bar */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-4">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> UNRETAIL PLATFORM CONTROL
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400">Environment: <strong className="text-slate-200">Production Boilerplate</strong></span>
            </div>

            {/* System Status Indicators */}
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Meilisearch Engine (Sub-50ms)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Razorpay Webhook Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cloudinary Signature Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Admin Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Executive Admin Desk
              </h1>
              <p className="text-xs text-slate-400">Marketplace Volume • Vendor Moderation • Dispute Oversight</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Customer View
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pb-3">
          <Link
            href="/admin/dashboard"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              pathname === '/admin/dashboard'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Overview & Analytics
          </Link>
          <Link
            href="/admin/dashboard?tab=vendors"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 whitespace-nowrap transition-all"
          >
            Vendor Moderation
          </Link>
          <Link
            href="/admin/dashboard?tab=catalog"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 whitespace-nowrap transition-all"
          >
            Global Catalog
          </Link>
          <Link
            href="/admin/dashboard?tab=disputes"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 whitespace-nowrap transition-all"
          >
            Disputes & Refunds
          </Link>
        </div>
      </header>

      {/* Main Admin Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
