'use client';

import Link from 'next/link';
import { Store, PlusCircle, Package, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function MerchantOverviewDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-2">
            <Store className="w-3.5 h-3.5" /> Merchant Command Desk
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Relic Vintage Co. Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Manage physical inventory, sync offline sales, and track real-time GMV.</p>
        </div>

        <Link
          href="/dashboard/new-item"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 shadow-lg shadow-teal-500/20 text-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" /> New Listing (60s Mobile Flow)
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total GMV Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">₹48,950</p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">+18.4% from last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Listed Items</span>
            <Package className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">18 Pieces</p>
          <span className="text-[11px] text-slate-400 mt-1 block">3 added today</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Sold Pieces</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">42 Pieces</p>
          <span className="text-[11px] text-cyan-400 mt-1 block font-medium">92% Sell-through rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Shop Verification</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">Verified</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Bandra West, Mumbai</span>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/listings"
          className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              Inventory Desk & Sync
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              View active listings, update status (Available / Sold), and sync offline sales.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/dashboard/new-item"
          className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Mobile 60-Second Listing Screen
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct Cloudinary image upload, category tagging, era selection & instant search index sync.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
