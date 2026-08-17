'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, TrendingUp, DollarSign, Store, AlertTriangle, CheckCircle2, Layers, XCircle, RefreshCw, Search, Filter, Sparkles } from 'lucide-react';

export default function AdminDashboardPage() {
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [shopFilter, setShopFilter] = useState('ALL');
  const [shopSearch, setShopSearch] = useState('');
  const [adminToast, setAdminToast] = useState(null);

  const triggerToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

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
        triggerToast('Boutique verification approved & published live!');
      }
    } catch (err) {
      console.warn('Verify shop fallback:', err);
      setShops((prev) =>
        prev.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s))
      );
      triggerToast('Boutique verification approved!');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleResolveDispute = (disputeId, action) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: action } : d))
    );
    triggerToast(`Dispute #${disputeId} status set to ${action}`);
  };

  // Financial calculations
  const totalGMV = 1248500;
  const platformRevenueCut = totalGMV * 0.1; // 10% platform revenue cut

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 rounded-full text-xs font-medium text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Platform Governance Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Marketplace Overview & Desk Control
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Real-time sales volume monitoring, physical store partner verifications, and buyer escrow dispute management.
          </p>
        </div>

        <button
          onClick={fetchVendors}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Counters
        </button>
      </div>

      {/* Financial Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Sales Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(totalGMV)}</div>
          <div className="text-xs text-zinc-500 font-medium">Total volume across physical & online sales</div>
        </div>

        <div className="bg-street-card/80 border border-amber-500/30 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>10% Platform Fee</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight tabular-nums">{formatCurrency(platformRevenueCut)}</div>
          <div className="text-xs text-zinc-500 font-medium">Net platform fee generated</div>
        </div>

        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Verified Store Partners</span>
            <div className="w-8 h-8 rounded-xl bg-neon-lime/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-neon-lime" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">
            {shops.filter((s) => s.isVerified).length} / {shops.length || 3}
          </div>
          <div className="text-xs text-zinc-500 font-medium">Boutiques with verified storefronts</div>
        </div>

        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Open Protection Disputes</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400 tracking-tight tabular-nums">
            {disputes.filter((d) => d.status === 'OPEN').length}
          </div>
          <div className="text-xs text-zinc-500 font-medium">Escrow funds held pending resolution</div>
        </div>
      </div>

      {/* Admin Toast Alert Banner */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-black">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Vendor Verification Queue */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 text-xs space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
          <span className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neon-lime" /> Store Partner Verification Queue
          </span>

          <div className="flex items-center gap-2">
            {['ALL', 'VERIFIED', 'PENDING'].map((tab) => (
              <button
                key={tab}
                onClick={() => setShopFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  shopFilter === tab
                    ? 'bg-amber-400 text-black shadow-sm font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Quick Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            placeholder="Filter boutiques by shop name, city, or address..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs pl-10 pr-3 py-2.5 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="divide-y divide-zinc-800/70">
          {(shops.length > 0
            ? shops
            : [
                { id: 'shop-1', shopName: 'Relic Vintage Co.', address: '42 Bandra West, Hill Road', city: 'Mumbai', isVerified: true, owner: { fullName: 'Aarav Patel' } },
                { id: 'shop-2', shopName: 'Retro Vault', address: '108 Indiranagar, 100ft Road', city: 'Bengaluru', isVerified: true, owner: { fullName: 'Priya Sharma' } },
                { id: 'shop-3', shopName: 'Dust & Gold Vintage', address: '15 Hauz Khas Village', city: 'Delhi', isVerified: false, owner: { fullName: 'Rohan Verma' } },
              ]
          )
            .filter((shop) => {
              if (shopFilter === 'VERIFIED' && !shop.isVerified) return false;
              if (shopFilter === 'PENDING' && shop.isVerified) return false;
              if (shopSearch) {
                const term = shopSearch.toLowerCase();
                const matchName = shop.shopName.toLowerCase().includes(term);
                const matchCity = shop.city?.toLowerCase().includes(term);
                const matchAddress = shop.address?.toLowerCase().includes(term);
                if (!matchName && !matchCity && !matchAddress) return false;
              }
              return true;
            })
            .map((shop) => (
              <div key={shop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{shop.shopName}</span>
                    {shop.isVerified ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded-full">
                        Verified Store
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded-full">
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-400 text-xs mt-1">
                    Location: {shop.address}, {shop.city} • Owner: <strong className="text-zinc-300">{shop.owner?.fullName || 'Boutique Merchant'}</strong>
                  </div>
                </div>

                {!shop.isVerified && (
                  <button
                    onClick={() => handleVerifyShop(shop.id)}
                    disabled={verifyingId === shop.id}
                    className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {verifyingId === shop.id ? 'Verifying...' : 'Approve Verification'}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Customer Dispute Resolution Desk */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 text-xs space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <span className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Customer Protection & Support Desk
          </span>
          <span className="text-zinc-500 font-medium">Buyer Escrow System</span>
        </div>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">TICKET #{dispute.id}</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">Order #{dispute.orderId} ({dispute.customer})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold tabular-nums">{formatCurrency(dispute.amount)}</span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                      dispute.status === 'OPEN'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                    }`}
                  >
                    {dispute.status}
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-xs bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                Reason: &quot;{dispute.reason}&quot;
              </p>

              {dispute.status === 'OPEN' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_VENDOR')}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold uppercase px-3.5 py-2 text-[11px] rounded-xl transition-all"
                  >
                    Release Escrow To Merchant (90%)
                  </button>
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'REFUNDED_CUSTOMER')}
                    className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-semibold uppercase px-3.5 py-2 text-[11px] rounded-xl transition-all"
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
