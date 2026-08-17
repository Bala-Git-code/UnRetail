'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Truck, CheckCircle2, ShieldCheck, DollarSign, Sparkles } from 'lucide-react';

export default function MerchantOrdersPage() {
  const vendorOrders = [
    {
      id: 'ord_90123',
      buyer: 'Thrift Collector (Delhi)',
      itemTitle: '1990s Vintage Levi 501 Heavyweight Denim',
      amount: 5499,
      platformCut: 550, // 10% cut
      netVendorPayout: 4949, // 90% payout
      status: 'PAID',
      createdAt: '2026-08-11T14:30:00Z',
    },
    {
      id: 'ord_88412',
      buyer: 'Priya S. (Bengaluru)',
      itemTitle: 'Distressed Harley Davidson Leather Jacket',
      amount: 12500,
      platformCut: 1250,
      netVendorPayout: 11250,
      status: 'SHIPPED',
      createdAt: '2026-08-08T10:15:00Z',
    },
  ];

  return (
    <div className="p-4 md:p-8 font-sans space-y-6 max-w-7xl mx-auto">
      <div className="pb-6 border-b border-zinc-800/80 space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vendor Escrow & Fulfillment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Merchant Orders & Payouts
        </h1>
        <p className="text-xs text-zinc-400 max-w-xl">
          Payment funds are released from escrow upon customer delivery verification. 10% platform service fee auto-deducted.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {vendorOrders.map((ord) => (
          <div key={ord.id} className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/70 gap-2">
              <div className="font-bold text-white text-sm font-mono">Order #{ord.id}</div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Payment Secured in Escrow
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Item Sold</span>
                <span className="font-semibold text-white text-sm">{ord.itemTitle}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Customer Buyer</span>
                <span className="font-semibold text-white text-sm">{ord.buyer}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Gross Order Amount</span>
                <span className="font-bold text-white text-base tabular-nums">{formatCurrency(ord.amount)}</span>
              </div>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Platform Fee (10%)</span>
                  <span className="text-rose-400 font-semibold tabular-nums">-{formatCurrency(ord.platformCut)}</span>
                </div>
                <div className="border-l border-zinc-800 pl-6">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Net Payout (90%)</span>
                  <span className="text-neon-lime font-bold text-base tabular-nums">{formatCurrency(ord.netVendorPayout)}</span>
                </div>
              </div>

              <button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95">
                Mark Shipped / Enter Tracking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
