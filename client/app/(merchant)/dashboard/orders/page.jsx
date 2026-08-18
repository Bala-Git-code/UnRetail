'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Truck, CheckCircle2, ShieldCheck, DollarSign, Sparkles, X, Clock } from 'lucide-react';

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [carrierName, setCarrierName] = useState('DTDC');
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/orders/merchant');
      if (res.data?.success && res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch merchant orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShipModal = (order) => {
    setSelectedOrder(order);
    setTrackingCode('');
    setCarrierName('DTDC');
    setModalOpen(true);
  };

  const handleMarkShipped = async (e) => {
    e.preventDefault();
    if (!trackingCode || !carrierName) return;
    setSubmitting(true);

    try {
      const res = await apiClient.patch(`/orders/${selectedOrder.id}/status`, {
        status: 'SHIPPED',
        trackingCode,
        carrierName,
      });

      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 'SHIPPED', trackingCode, carrierName } : o))
        );
        setModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to ship order:', err);
      alert(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const res = await apiClient.patch(`/orders/${orderId}/status`, {
        status: 'DELIVERED',
      });

      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'DELIVERED',
                  escrowStatus: 'ESCROW_HELD',
                  escrowReleaseDate: res.data.data.escrowReleaseDate,
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark delivered:', err);
      alert(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (order) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Unpaid / Checkout Session
          </span>
        );
      case 'PAID':
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Payment Secured (Needs Shipping)
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            In Transit (Shipped)
          </span>
        );
      case 'DELIVERED':
        if (order.escrowStatus === 'DISPUTED') {
          return (
            <span className="bg-rose-500/15 text-rose-400 border border-rose-500/25 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Funds Disputed / Locked
            </span>
          );
        }
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered (Escrow Held)
          </span>
        );
      default:
        return null;
    }
  };

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
          Fulfillment release triggers payout within 48 hours of customer delivery. 10% platform service fee auto-deducted.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-street-card/85 border border-zinc-800 rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Merchant Orders Found</h3>
          <p className="text-xs text-zinc-400">Products bought through Razorpay checkout appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {orders.map((ord) => {
            const platformCut = ord.amountPaid * 0.10;
            const netPayout = ord.amountPaid * 0.90;
            
            return (
              <div key={ord.id} className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/70 gap-2">
                  <div className="font-bold text-white text-sm font-mono">Order #{ord.id.substring(0, 8)}</div>
                  {getStatusBadge(ord)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Item Sold</span>
                    <span className="font-semibold text-white text-sm">{ord.item?.title || 'Seeded Listing'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Customer Buyer</span>
                    <span className="font-semibold text-white text-sm">{ord.buyer?.fullName || ord.buyer?.email || 'Thrift Collector'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Gross Order Amount</span>
                    <span className="font-bold text-white text-base tabular-nums">{formatCurrency(ord.amountPaid)}</span>
                  </div>
                </div>

                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-semibold">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Platform Fee (10%)</span>
                      <span className="text-rose-400 tabular-nums">-{formatCurrency(platformCut)}</span>
                    </div>
                    <div className="border-l border-zinc-800 pl-6">
                      <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Net Payout (90%)</span>
                      <span className="text-neon-lime text-base tabular-nums">{formatCurrency(netPayout)}</span>
                    </div>
                    {ord.trackingCode && (
                      <div className="border-l border-zinc-800 pl-6">
                        <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Carrier / Tracking</span>
                        <span className="text-zinc-300 font-mono text-xs">{ord.carrierName}: {ord.trackingCode}</span>
                      </div>
                    )}
                  </div>

                  {ord.status === 'PAID' && (
                    <button
                      onClick={() => handleOpenShipModal(ord)}
                      className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      Mark Shipped / Enter Tracking
                    </button>
                  )}

                  {ord.status === 'SHIPPED' && (
                    <button
                      onClick={() => handleMarkDelivered(ord.id)}
                      disabled={updatingId === ord.id}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {updatingId === ord.id ? 'Updating...' : 'Mark Delivered (Start Escrow Held)'}
                    </button>
                  )}

                  {ord.status === 'DELIVERED' && ord.escrowStatus === 'ESCROW_HELD' && (
                    <div className="text-[10px] text-zinc-500 italic max-w-xs text-right font-medium">
                      Escrow Release Target: {new Date(ord.escrowReleaseDate).toLocaleString()} (Subject to buyer check window).
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shipping Input Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-street-card border border-zinc-800 rounded-3xl p-6 relative space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Enter Shipment Details</h3>
              <p className="text-zinc-400 text-xs">Enter tracking specifications to transition order to Shipped.</p>
            </div>

            <form onSubmit={handleMarkShipped} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-zinc-200 uppercase tracking-wider block">Courier Carrier Name</label>
                <input
                  type="text"
                  required
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  placeholder="e.g. DTDC, BlueDart, Delhivery"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 focus:outline-none focus:border-neon-lime transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-200 uppercase tracking-wider block">Tracking ID / Code</label>
                <input
                  type="text"
                  required
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="e.g. DTDC-99283-A"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 focus:outline-none focus:border-neon-lime transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Updating Order...' : 'Confirm Shipment Info'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
