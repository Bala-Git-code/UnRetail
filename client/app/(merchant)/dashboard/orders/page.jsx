'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Truck, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

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
    <div className="p-4 md:p-8 font-sans space-y-6">
      <div className="pb-6 border-b border-zinc-800 font-mono">
        <span className="text-xs text-neon-lime uppercase tracking-widest block">VENDOR ESCROW & FULFILLMENT</span>
        <h1 className="text-3xl font-black uppercase text-white tracking-tight">
          Merchant Orders & Payouts
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Payment funds are released from escrow upon customer delivery verification. 10% platform service fee auto-deducted.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {vendorOrders.map((ord) => (
          <div key={ord.id} className="bg-street-card border border-zinc-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
              <div className="font-bold text-white uppercase text-sm">Order #{ord.id}</div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-bold uppercase">
                Payment Secured in Escrow
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-zinc-500 block uppercase text-[10px]">Item Sold</span>
                <span className="font-bold text-white">{ord.itemTitle}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[10px]">Customer Buyer</span>
                <span className="font-bold text-white">{ord.buyer}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[10px]">Gross Order Amount</span>
                <span className="font-extrabold text-white text-sm">{formatCurrency(ord.amount)}</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Platform Service Fee (10%)</span>
                  <span className="text-rose-400 font-bold">-{formatCurrency(ord.platformCut)}</span>
                </div>
                <div className="border-l border-zinc-800 pl-4">
                  <span className="text-zinc-500 text-[10px] uppercase block">Net Merchant Payout (90%)</span>
                  <span className="text-neon-lime font-black text-sm">{formatCurrency(ord.netVendorPayout)}</span>
                </div>
              </div>

              <button className="bg-zinc-900 border border-zinc-700 text-white font-bold uppercase px-4 py-2 hover:border-zinc-500">
                Mark Shipped / Enter Tracking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
