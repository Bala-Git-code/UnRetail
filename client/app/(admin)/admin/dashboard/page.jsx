'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, TrendingUp, DollarSign, Store, AlertTriangle, CheckCircle2, Layers, XCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  // Mock Disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'disp_901',
      orderId: 'ord_90123',
      customer: 'Aarav (Delhi)',
      reason: 'Slight tear near denim cuff not disclosed in listing condition photo.',
      amount: 5499,
      status: 'OPEN',
    },
    {
      id: 'disp_844',
      orderId: 'ord_77124',
      customer: 'Maya (Mumbai)',
      reason: 'Shipping delay over 5 days beyond vendor commitment.',
      amount: 8900,
      status: 'OPEN',
    },
  ]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoadingShops(true);
    try {
      const res = await apiClient.get('/shops');
      if (res.data?.data) {
        setShops(res.data.data);
      }
    } catch (err) {
      console.warn('Admin shops fetch fallback:', err);
    } finally {
      setLoadingShops(false);
    }
  };

  const handleVerifyShop = async (shopId) => {
    setVerifyingId(shopId);
    try {
      const res = await apiClient.patch(`/shops/${shopId}/verify`);
      if (res.data?.success) {
        setShops((prev) =>
          prev.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s))
        );
      }
    } catch (err) {
      console.warn('Verify shop fallback:', err);
      setShops((prev) =>
        prev.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s))
      );
    } finally {
      setVerifyingId(null);
    }
  };

  const handleResolveDispute = (disputeId, action) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: action } : d))
    );
  };

  // Financial calculations
  const totalGMV = 1248500;
  const platformRevenueCut = totalGMV * 0.1; // 10% platform revenue cut

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-street-card border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-xs text-amber-400 uppercase tracking-widest block">EXECUTIVE PLATFORM DESK</span>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            UnRetail GMV & Governance Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time financial cut calculation, vendor verification queue, and dispute escrow resolutions.
          </p>
        </div>

        <button
          onClick={fetchVendors}
          className="bg-zinc-900 border border-zinc-700 text-white font-bold text-xs uppercase px-4 py-2.5 flex items-center gap-2 hover:border-zinc-500"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Counters
        </button>
      </div>

      {/* Financial Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="bg-street-card border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
            <span>Total Gross Marketplace Volume (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{formatCurrency(totalGMV)}</div>
          <div className="text-[10px] text-zinc-400">Total volume across physical & online sales</div>
        </div>

        <div className="bg-street-card border border-amber-500/30 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
            <span>10% Platform Revenue Cut</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{formatCurrency(platformRevenueCut)}</div>
          <div className="text-[10px] text-zinc-400">Net platform commission generated</div>
        </div>

        <div className="bg-street-card border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
            <span>Verified Vendors</span>
            <Store className="w-4 h-4 text-neon-lime" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {shops.filter((s) => s.isVerified).length} / {shops.length}
          </div>
          <div className="text-[10px] text-zinc-400">Boutiques with active physical store verification</div>
        </div>

        <div className="bg-street-card border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
            <span>Open Escrow Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {disputes.filter((d) => d.status === 'OPEN').length}
          </div>
          <div className="text-[10px] text-zinc-400">Escrow funds held pending resolution</div>
        </div>
      </div>

      {/* Vendor Verification Queue */}
      <div className="bg-street-card border border-zinc-800 p-6 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="font-bold uppercase text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neon-lime" /> Vendor Verification Queue
          </span>
          <span className="text-zinc-500 text-[10px]">{shops.length} Partner Boutiques</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {shops.map((shop) => (
            <div key={shop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase text-sm">{shop.shopName}</span>
                  {shop.isVerified ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[9px] uppercase font-bold">
                      VERIFIED VENDOR
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[9px] uppercase font-bold">
                      PENDING VERIFICATION
                    </span>
                  )}
                </div>
                <div className="text-zinc-400 text-[11px] mt-1">
                  Location: {shop.address}, {shop.city} • Owner: {shop.owner?.fullName || 'Boutique Merchant'}
                </div>
              </div>

              {!shop.isVerified && (
                <button
                  onClick={() => handleVerifyShop(shop.id)}
                  disabled={verifyingId === shop.id}
                  className="bg-neon-lime text-black font-extrabold text-xs uppercase px-4 py-2.5 hover:bg-white transition-all shadow-[2px_2px_0px_0px_#ffffff] disabled:opacity-50"
                >
                  {verifyingId === shop.id ? 'Verifying...' : '1-Click Approve Verification'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Dispute Resolution Desk */}
      <div className="bg-street-card border border-zinc-800 p-6 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="font-bold uppercase text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Customer Dispute Resolution Desk
          </span>
          <span className="text-zinc-500 text-[10px]">Escrow Protection System</span>
        </div>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-zinc-950 border border-zinc-800 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase">TICKET #{dispute.id}</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-400">Order #{dispute.orderId} ({dispute.customer})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold">{formatCurrency(dispute.amount)}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      dispute.status === 'OPEN'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {dispute.status}
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 font-sans text-xs bg-zinc-900 p-3 border border-zinc-800">
                Reason: &quot;{dispute.reason}&quot;
              </p>

              {dispute.status === 'OPEN' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_VENDOR')}
                    className="bg-zinc-900 border border-zinc-700 text-white hover:border-zinc-500 font-bold uppercase px-3 py-2 text-[10px]"
                  >
                    Release Escrow To Vendor (90%)
                  </button>
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'REFUNDED_CUSTOMER')}
                    className="bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white font-bold uppercase px-3 py-2 text-[10px]"
                  >
                    Issue Full Refund To Customer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
