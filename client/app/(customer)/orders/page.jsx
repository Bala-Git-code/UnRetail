'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Package, Truck, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, X, ExternalLink, Sparkles } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [submittedDispute, setSubmittedDispute] = useState(null);

  const mockOrders = [
    {
      id: 'ord_90123',
      razorpayOrderId: 'order_Nx823Hdfa89',
      itemTitle: '1990s Vintage Levi 501 Heavyweight Denim',
      itemImage: '/images/denim_vintage.png',
      shopName: 'Relic Vintage Co.',
      shopCity: 'Mumbai',
      amountPaid: 5499,
      status: 'PAID', // PENDING, PAID, SHIPPED, DELIVERED
      createdAt: '2026-08-11T14:30:00Z',
    },
    {
      id: 'ord_88412',
      razorpayOrderId: 'order_Kj9910aBc22',
      itemTitle: 'Distressed Harley Davidson Leather Jacket',
      itemImage: '/images/leather_jacket.png',
      shopName: 'Retro Vault',
      shopCity: 'Bengaluru',
      amountPaid: 12500,
      status: 'SHIPPED',
      trackingCode: 'DTDC-8849201',
      createdAt: '2026-08-08T10:15:00Z',
    },
  ];

  const handleReportIssue = (e) => {
    e.preventDefault();
    setSubmittedDispute({
      id: `disp_${Math.random().toString(36).substring(2, 8)}`,
      orderId: selectedOrder?.id,
      reason: disputeReason,
      status: 'OPEN',
    });
    setDisputeModalOpen(false);
    setDisputeReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Payment Secured in Escrow
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            <Truck className="w-3.5 h-3.5" />
            In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-neon-lime/15 text-neon-lime border border-neon-lime/30 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            Processing Order
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Purchases & Escrow Timeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Track real-time courier statuses, verify Razorpay escrow protection, and manage order deliveries.
          </p>
        </div>

        <Link
          href="/feed"
          className="bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 hover:text-white hover:border-zinc-500 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm w-fit active:scale-95"
        >
          <span>Browse Catalog Racks</span>
          <ArrowRight className="w-3.5 h-3.5 text-neon-lime" />
        </Link>
      </div>

      {submittedDispute && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300 flex items-center justify-between shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Dispute Ticket <strong className="text-amber-200">#{submittedDispute.id}</strong> opened for Order <strong className="text-white">#{submittedDispute.orderId}</strong>. Escrow funds are frozen under platform resolution.
            </span>
          </div>
          <button
            onClick={() => setSubmittedDispute(null)}
            className="text-zinc-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 hover:border-zinc-700/90 transition-all duration-300 shadow-xl backdrop-blur-sm"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/70 gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-zinc-400">
                <span className="font-mono font-semibold text-white bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1">
                  ORDER #{order.id}
                </span>
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="font-mono text-zinc-400">
                  Ref: <span className="text-zinc-300">{order.razorpayOrderId}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-zinc-400 font-medium text-xs">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Order Content */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 overflow-hidden shadow-md">
                  <img
                    src={order.itemImage || '/images/denim_vintage.png'}
                    alt={order.itemTitle}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/denim_vintage.png';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    {order.itemTitle}
                  </h3>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <span>Vendor: <strong className="text-zinc-200 font-medium">{order.shopName}</strong> ({order.shopCity})</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-neon-lime inline" />
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight tabular-nums pt-0.5">
                    {formatCurrency(order.amountPaid)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setDisputeModalOpen(true);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 text-zinc-300 hover:text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 flex-1 md:flex-initial transition-all active:scale-95 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Delivery Timeline Stepper */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="uppercase tracking-wider text-[11px] text-zinc-500 font-semibold">
                  Delivery Timeline Status
                </span>
                <span className="text-neon-lime font-mono text-[11px]">
                  Protected by Razorpay Escrow
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">1. Order Placed</div>
                    <div className="text-[11px] text-zinc-500">Confirmed</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
                          ? 'text-emerald-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      2. Escrow Paid
                    </div>
                    <div className="text-[11px] text-zinc-500">Razorpay Verified</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      order.status === 'SHIPPED' || order.status === 'DELIVERED'
                        ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'text-blue-400' : 'text-zinc-500'
                      }`}
                    >
                      3. Shipped
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {order.trackingCode || 'Vendor Packing'}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      order.status === 'DELIVERED'
                        ? 'bg-neon-lime/15 border border-neon-lime/40 text-neon-lime shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        order.status === 'DELIVERED' ? 'text-neon-lime' : 'text-zinc-500'
                      }`}
                    >
                      4. Delivered
                    </div>
                    <div className="text-[11px] text-zinc-500">Handed to Collector</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute Modal */}
      {disputeModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-street-card border border-zinc-700/80 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setDisputeModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Open Escrow Dispute / Report Issue</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Escrow funds for Order <strong className="text-white">#{selectedOrder.id}</strong> ({selectedOrder.itemTitle}) are held in UnRetail security escrow until reviewed by our resolution team.
              </p>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs block">
                  Describe Issue / Condition Mismatch
                </label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Provide details about condition variance, delayed shipment, or incorrect item..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Submit Dispute Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs uppercase tracking-wider py-3 px-5 rounded-xl border border-zinc-800 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
