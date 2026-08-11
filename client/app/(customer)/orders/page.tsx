'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Store, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders] = useState([
    {
      id: 'ord_9823a10f',
      itemId: 'item-101',
      itemTitle: '1990s Vintage Levi 501 Heavyweight Denim',
      shopName: 'Relic Vintage Co.',
      shopCity: 'Mumbai',
      amountPaid: 68.0,
      razorpayOrderId: 'order_Mb72xPq910',
      razorpayPaymentId: 'pay_Nq31zKp881',
      status: 'PAID',
      createdAt: '2026-08-11',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'ord_4419c82b',
      itemId: 'item-104',
      itemTitle: 'Handcrafted Japanese Indigo Kimono Robe',
      shopName: 'Tokyo Thrift Loft',
      shopCity: 'Delhi',
      amountPaid: 140.0,
      razorpayOrderId: 'order_Kz19xAb442',
      razorpayPaymentId: 'pay_Lp88yRt901',
      status: 'SHIPPED',
      createdAt: '2026-08-09',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Orders & History</h1>
        <p className="text-xs text-slate-400 mt-1">Track live shipping states and verified Razorpay receipts.</p>
      </div>

      <div className="space-y-6">
        {orders.map((ord) => (
          <div key={ord.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-xs text-slate-400 font-mono">Order #{ord.id}</span>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Store className="w-3.5 h-3.5 text-emerald-400" /> {ord.shopName} ({ord.shopCity})
                </p>
              </div>

              <div className="flex items-center gap-2">
                {ord.status === 'PAID' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Order Paid
                  </span>
                )}
                {ord.status === 'SHIPPED' && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> In Transit
                  </span>
                )}
              </div>
            </div>

            {/* Content row */}
            <div className="flex items-center gap-4">
              <img src={ord.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{ord.itemTitle}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Razorpay Payment ID: <code className="text-emerald-400 font-mono">{ord.razorpayPaymentId}</code>
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-white">₹{ord.amountPaid}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{ord.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
