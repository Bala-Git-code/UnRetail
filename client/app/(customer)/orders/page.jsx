'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Package, Truck, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';

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
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold uppercase">Payment Secured in Escrow</span>;
      case 'SHIPPED':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold uppercase">In Transit</span>;
      case 'DELIVERED':
        return <span className="bg-neon-lime/10 text-neon-lime border border-neon-lime/30 px-3 py-1 font-mono text-xs font-bold uppercase">Delivered</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 font-mono text-xs font-bold uppercase">Processing Order</span>;
    }
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8 pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-neon-lime uppercase tracking-widest">
            CUSTOMER PURCHASES & TIMELINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            My Order Dashboard
          </h1>
        </div>

        <Link
          href="/feed"
          className="bg-zinc-900 border border-zinc-800 text-white font-mono text-xs uppercase px-4 py-2.5 hover:border-zinc-600 flex items-center gap-2"
        >
          Browse Racks <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {submittedDispute && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 p-4 text-xs font-mono text-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Dispute Ticket #{submittedDispute.id} created for Order #{submittedDispute.orderId}. Status: OPEN (Platform Desk Reviewing).
            </span>
          </div>
          <button onClick={() => setSubmittedDispute(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-street-card border border-zinc-800 p-6 font-sans space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">ORDER ID: #{order.id}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">Razorpay Ref: {order.razorpayOrderId}</span>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-zinc-500">
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
                <div className="w-20 h-24 bg-zinc-950 border border-zinc-800 shrink-0 overflow-hidden">
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
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">{order.itemTitle}</h3>
                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <span>Vendor: {order.shopName} ({order.shopCity})</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-neon-lime inline" />
                  </div>
                  <div className="text-lg font-black font-mono text-white pt-1">
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
                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 font-mono text-xs font-bold uppercase px-4 py-3 flex items-center justify-center gap-2 flex-1 md:flex-initial"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Delivery Timeline Badges */}
            <div className="bg-zinc-950 border border-zinc-800/80 p-4 font-mono text-xs space-y-3">
              <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                ORDER DELIVERY TIMELINE STATUS
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <div>
                    <div className="font-bold uppercase">1. Order Placed</div>
                    <div className="text-[10px] text-zinc-500">Confirmed</div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
                      ? 'text-emerald-400'
                      : 'text-zinc-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <div>
                    <div className="font-bold uppercase">2. Escrow Paid</div>
                    <div className="text-[10px] text-zinc-500">Razorpay Verified</div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <div>
                    <div className="font-bold uppercase">3. Shipped</div>
                    <div className="text-[10px] text-zinc-500">
                      {order.trackingCode || 'Vendor Packing'}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    order.status === 'DELIVERED' ? 'text-neon-lime' : 'text-zinc-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <div>
                    <div className="font-bold uppercase">4. Delivered</div>
                    <div className="text-[10px] text-zinc-500">Handed to Customer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute Modal */}
      {disputeModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-street-card border border-zinc-700 w-full max-w-lg p-6 font-mono text-xs space-y-4 shadow-2xl relative">
            <button
              onClick={() => setDisputeModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-sm">
              <AlertTriangle className="w-5 h-5" /> Report Issue / Open Escrow Dispute
            </div>

            <p className="text-zinc-400 text-[11px]">
              Escrow funds for Order #{selectedOrder.id} ({selectedOrder.itemTitle}) are held in UnRetail protection until resolved.
            </p>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="text-zinc-300 font-bold uppercase block mb-1">Issue Category / Reason</label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe condition mismatch, shipping delay, or defect..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 font-sans focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 text-black font-extrabold text-xs uppercase py-3 hover:bg-white"
                >
                  Submit Dispute Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase py-3 px-4 border border-zinc-800 hover:text-white"
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
