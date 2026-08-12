'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Layers, ShoppingBag, TrendingUp, Zap, ShieldCheck, ArrowRight, Store, DollarSign } from 'lucide-react';

export default function MerchantDashboardPage() {
  const stats = [
    { title: 'Gross Revenue', value: '₹98,400', subtitle: '+18% from last month', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Active Rack Inventory', value: '18 Items', subtitle: 'Live in digital catalog', icon: Layers, color: 'text-neon-lime' },
    { title: 'Total Items Sold', value: '14 Items', subtitle: 'In-store & online combined', icon: ShoppingBag, color: 'text-white' },
    { title: 'Net Vendor Payout (90%)', value: '₹88,560', subtitle: 'After 10% platform cut', icon: DollarSign, color: 'text-amber-400' },
  ];

  const recentRackSales = [
    { id: 'item-101', title: '1990s Vintage Levi 501 Heavyweight', price: 5499, channel: 'In-Store Scan', date: 'Today, 02:15 PM' },
    { id: 'item-102', title: 'Distressed Harley Davidson Jacket', price: 12500, channel: 'Online Order', date: 'Yesterday, 06:40 PM' },
    { id: 'item-103', title: 'Y2K Stussy Graphic Heavyweight Tee', price: 2800, channel: 'In-Store Scan', date: '10 Aug, 11:20 AM' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-street-card border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-lime uppercase tracking-widest mb-1">
            <Zap className="w-3.5 h-3.5 fill-neon-lime" /> VENDOR CONTROL DESK
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            Boutique Performance & Rack Analytics
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Relic Vintage Co. (Bandra West, Mumbai) • Verified Merchant #MCH-4809
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/new-item"
            className="bg-neon-lime text-black font-black text-xs uppercase tracking-wider px-5 py-3 flex items-center gap-2 hover:bg-white transition-all shadow-[3px_3px_0px_0px_#ffffff]"
          >
            <PlusCircle className="w-4 h-4" /> 60-Sec New Listing
          </Link>
          <Link
            href="/dashboard/listings"
            className="bg-zinc-900 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 hover:border-zinc-500"
          >
            Rack Inventory
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-street-card border border-zinc-800 p-5 space-y-3 hover:border-zinc-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">{stat.title}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-zinc-400">{stat.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <Link
          href="/dashboard/new-item"
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group"
        >
          <div className="w-10 h-10 bg-neon-lime/10 border border-neon-lime/30 text-neon-lime flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            Mobile Camera 60-Sec Upload
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Snap photos from mobile camera, select era/condition pills, auto-generate signed Cloudinary signature, and publish.
          </p>
          <div className="text-neon-lime font-bold uppercase flex items-center gap-1">
            Open Listing Camera <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/listings"
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group"
        >
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            1-Tap In-Store Mark Sold Sync
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Sold a jacket to a walk-in physical customer? Tap once to instantly flip status to SOLD and update live search index.
          </p>
          <div className="text-amber-400 font-bold uppercase flex items-center gap-1">
            View Rack Inventory <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/orders"
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            Escrow Payouts & Shipping
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Track Razorpay escrow holds, enter shipping tracking numbers, and view platform 10% commission fee breakdowns.
          </p>
          <div className="text-emerald-400 font-bold uppercase flex items-center gap-1">
            Vendor Orders Rack <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Recent Sales Rack Table */}
      <div className="bg-street-card border border-zinc-800 p-6 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="font-bold uppercase text-white text-sm">Recent Storefront Sales Log</span>
          <span className="text-zinc-500 text-[10px]">Real-Time Sync</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {recentRackSales.map((sale) => (
            <div key={sale.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-white uppercase text-sm">{sale.title}</div>
                <div className="text-[10px] text-zinc-500">Item ID: #{sale.id} • {sale.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 text-[10px] uppercase">
                  {sale.channel}
                </span>
                <span className="font-extrabold text-neon-lime text-base">{formatCurrency(sale.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
