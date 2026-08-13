'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Layers, ShoppingBag, TrendingUp, Zap, ShieldCheck, ArrowRight, Store, DollarSign, CheckCircle2 } from 'lucide-react';

export default function MerchantDashboardPage() {
  const [recentSales, setRecentSales] = useState([
    { id: 'item-101', title: '1990s Vintage Levi 501 Heavyweight', price: 5499, channel: 'In-Store Scan', date: 'Today, 02:15 PM', status: 'SOLD' },
    { id: 'item-102', title: 'Distressed Harley Davidson Jacket', price: 12500, channel: 'Online Order', date: 'Yesterday, 06:40 PM', status: 'SOLD' },
    { id: 'item-103', title: 'Y2K Stussy Graphic Heavyweight Tee', price: 2800, channel: 'In-Store Scan', date: '10 Aug, 11:20 AM', status: 'AVAILABLE' },
  ]);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleItemStatus = (itemId) => {
    setRecentSales((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextStatus = item.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
          setToastMessage(`Status for "${item.title}" updated to ${nextStatus}`);
          setTimeout(() => setToastMessage(null), 3000);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const stats = [
    { title: 'Gross Store Sales', value: '₹98,400', subtitle: '+18% from last month', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Active Rack Inventory', value: `${recentSales.filter(i => i.status === 'AVAILABLE').length + 15} Items`, subtitle: 'Live in digital catalog', icon: Layers, color: 'text-neon-lime' },
    { title: 'Total Items Sold', value: `${recentSales.filter(i => i.status === 'SOLD').length + 12} Items`, subtitle: 'In-store & online combined', icon: ShoppingBag, color: 'text-white' },
    { title: 'Net Vendor Payout (90%)', value: '₹88,560', subtitle: 'After 10% platform service fee', icon: DollarSign, color: 'text-amber-400' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-street-card border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-lime uppercase tracking-widest mb-1">
            <Zap className="w-3.5 h-3.5 fill-neon-lime" /> MERCHANT STORE PORTAL
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            Boutique Performance & Inventory Analytics
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Relic Vintage Co. (Bandra West, Mumbai) • Verified Merchant Partner
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/new-item"
            className="bg-neon-lime text-black font-black text-xs uppercase tracking-wider px-5 py-3 flex items-center gap-2 hover:bg-white transition-all shadow-[3px_3px_0px_0px_#ffffff]"
          >
            <PlusCircle className="w-4 h-4" /> Quick Item Listing
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
            <div key={idx} className="bg-street-card border border-zinc-800 p-5 space-y-3 hover:border-zinc-600 transition-all card-hover-effect">
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
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect"
        >
          <div className="w-10 h-10 bg-neon-lime/10 border border-neon-lime/30 text-neon-lime flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            Quick Mobile Photo Listing
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Snap photos directly from mobile camera, choose era/condition pills, and publish immediately to live customer feeds.
          </p>
          <div className="text-neon-lime font-bold uppercase flex items-center gap-1">
            Open Listing Camera <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/listings"
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect"
        >
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            Instant In-Store Sold Sync
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Sold an item to a physical walk-in customer? Tap once to instantly toggle status to SOLD and update live catalog feeds.
          </p>
          <div className="text-amber-400 font-bold uppercase flex items-center gap-1">
            View Rack Inventory <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/orders"
          className="bg-street-card border border-zinc-800 p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect"
        >
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase group-hover:text-neon-lime transition-colors">
            Escrow Payouts & Shipping
          </h3>
          <p className="text-zinc-400 font-sans text-xs">
            Track escrow releases, enter courier tracking numbers, and view clear 90% net vendor payout breakdowns.
          </p>
          <div className="text-emerald-400 font-bold uppercase flex items-center gap-1">
            Vendor Orders Rack <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neon-lime text-black font-mono text-xs font-bold px-4 py-3 border-2 border-black shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Recent Sales & In-Store Sync Rack Table */}
      <div className="bg-street-card border border-zinc-800 p-6 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="font-bold uppercase text-white text-sm">Recent Storefront Sales & Sync Log</span>
          <span className="text-zinc-500 text-[10px]">Real-Time In-Store Sync</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {recentSales.map((sale) => (
            <div key={sale.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white uppercase text-sm">{sale.title}</div>
                <div className="text-[10px] text-zinc-500">Item ID: #{sale.id} • {sale.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 text-[10px] uppercase">
                  {sale.channel}
                </span>
                <span className="font-extrabold text-white text-sm">{formatCurrency(sale.price)}</span>
                <button
                  onClick={() => toggleItemStatus(sale.id)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase border transition-all ${
                    sale.status === 'SOLD'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-black'
                  }`}
                >
                  {sale.status === 'SOLD' ? 'MARK AVAILABLE' : 'MARK SOLD'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
