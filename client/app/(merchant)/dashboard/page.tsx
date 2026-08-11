'use client';

import Link from 'next/link';
import { Store, PlusCircle, Package, DollarSign, TrendingUp, Sparkles, ArrowRight, Camera, CheckCircle2 } from 'lucide-react';

export default function MerchantOverviewDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Action Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-teal-500/20 via-slate-900 to-slate-900 border border-teal-500/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Mobile 60-Second Upload Engine
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Snap & Sell 1-of-1 Pieces</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Point your mobile camera at store racks, auto-crop photos, set era & condition pills, and publish directly to the global discovery feed.
          </p>
        </div>

        <Link
          href="/dashboard/new-item"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:opacity-95 shadow-xl shadow-teal-500/25 transition-all text-sm shrink-0 z-10 transform hover:scale-105"
        >
          <Camera className="w-5 h-5 stroke-[2.5]" /> Snap & Sell Now
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today&apos;s Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">₹48,950</p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">+18.4% vs last week</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Racks</span>
            <Package className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">18 Pieces</p>
          <span className="text-[11px] text-slate-400 mt-1 block">3 added today</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Items Sold</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">42 Pieces</p>
          <span className="text-[11px] text-cyan-400 mt-1 block font-medium">92% Sell-through rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Shop Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">Verified</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Relic Vintage Co.</span>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/listings"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              Inventory Desk & In-Store Sync
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle 1-tap &quot;Mark Sold In-Store&quot; to instant sync physical counter sales.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/dashboard/new-item"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Mobile 60s Camera Listing Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct signed Cloudinary CDN image uploads without backend memory bottlenecks.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
