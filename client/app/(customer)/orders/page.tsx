'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Store, ArrowRight, ShieldCheck, Clock, AlertTriangle, X, Check } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

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

  const handleOpenDispute = (order: any) => {
    setSelectedOrder(order);
    setDisputeSubmitted(false);
    setDisputeReason('');
    setDisputeModalOpen(true);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Purchases & Orders</h1>
        <p className="text-xs text-slate-400 mt-1">Track shipping updates and verified Razorpay receipts.</p>
      </div>

      <div className="space-y-6">
        {orders.map((ord) => (
          <div key={ord.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-xs text-slate-400 font-mono">Order #{ord.id}</span>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 font-semibold">
                  <Store className="w-3.5 h-3.5 text-emerald-400" /> {ord.shopName} ({ord.shopCity})
                </p>
              </div>

              {/* Delivery Stage Badges */}
              <div className="flex items-center gap-2">
                {ord.status === 'PAID' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Order Paid
                  </span>
                )}
                {ord.status === 'SHIPPED' && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Shipped & In Transit
                  </span>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={ord.image} alt="" className="w-16 h-16 rounded-2xl object-cover bg-slate-950 border border-slate-800 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">{ord.itemTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Razorpay Payment ID: <code className="text-emerald-400 font-mono">{ord.razorpayPaymentId}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <span className="text-xl font-extrabold text-white">₹{ord.amountPaid}</span>
                <button
                  onClick={() => handleOpenDispute(ord)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Report Issue / Dispute
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Issue / Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setDisputeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Open Customer Dispute Ticket</h3>
                <p className="text-[11px] text-slate-400">Order #{selectedOrder?.id}</p>
              </div>
            </div>

            {disputeSubmitted ? (
              <div className="py-8 text-center text-emerald-400 space-y-2">
                <Check className="w-10 h-10 mx-auto" />
                <p className="text-sm font-bold">Dispute Ticket Logged Successfully!</p>
                <p className="text-xs text-slate-400">UnRetail Admin & Store Owner notified for resolution.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Dispute</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    <option>Item Condition Flaw Mismatch</option>
                    <option>Size Discrepancy</option>
                    <option>Shipping Delay / Tracking Issue</option>
                    <option>Damaged in Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Details & Photo Description</label>
                  <textarea
                    rows={3}
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe the issue with the received piece..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-rose-400 to-amber-400 text-xs hover:opacity-95 shadow-lg shadow-rose-500/20"
                >
                  Submit Dispute Ticket to Admin
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
