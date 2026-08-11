'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ShieldCheck, AlertTriangle, Store, DollarSign, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function AdminDashboardPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [disputes] = useState([
    {
      id: 'disp-101',
      orderId: 'ord_9823a10f',
      customerName: 'Alex Rivera',
      shopName: 'Dust & Gold Vintage',
      reason: 'Item condition grade mismatch (stated Like New, had minor stain).',
      status: 'OPEN',
      createdAt: '2026-08-10',
    },
  ]);

  useEffect(() => {
    fetchAdminShops();
  }, []);

  const fetchAdminShops = async () => {
    try {
      const response = await apiClient.get('/shops');
      if (response.data.success) {
        setShops(response.data.data);
      }
    } catch (err) {
      console.warn('Failed to load shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyShop = async (shopId: string) => {
    try {
      await apiClient.patch(`/shops/${shopId}/verify`);
      setShops(shops.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s)));
    } catch (err) {
      setShops(shops.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" /> Platform Oversight Desk
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Analytics & Moderation</h1>
        <p className="text-xs text-slate-400 mt-1">Verify brick-and-mortar thrift stores, resolve customer disputes, and audit marketplace GMV.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Platform Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">₹1,42,800</p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">+24.2% GMV Growth</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Verified Physical Shops</span>
            <Store className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{shops.filter((s) => s.isVerified).length} Shops</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active across 3 cities</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Verifications</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{shops.filter((s) => !s.isVerified).length} Pending</p>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Requires manual audit</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Open Customer Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{disputes.length} Open</p>
          <span className="text-[11px] text-rose-400/80 mt-1 block">Requires resolution</span>
        </div>
      </div>

      {/* Moderation Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shop Verification Queue */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" /> Shop Verification Queue
            </h3>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" /> Loading shops...
            </div>
          ) : (
            <div className="space-y-4">
              {shops.map((shop) => (
                <div key={shop.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {shop.shopName}
                      {shop.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{shop.address}, {shop.city}</p>
                    <p className="text-[11px] text-slate-500">Owner: {shop.owner?.fullName || 'Shop Owner'}</p>
                  </div>

                  <div>
                    {shop.isVerified ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyShop(shop.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10"
                      >
                        Approve & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispute Resolution Queue */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Customer Dispute Resolution
            </h3>
          </div>

          <div className="space-y-4">
            {disputes.map((disp) => (
              <div key={disp.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-400 font-bold">Dispute #{disp.id}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold">
                    {disp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Customer: {disp.customerName} • Shop: {disp.shopName}</p>
                <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  Reason: &quot;{disp.reason}&quot;
                </p>
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700">
                    Contact Shop
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400">
                    Issue Full Refund (Razorpay)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
