'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import MerchantOnboardingModal from '@/components/MerchantOnboardingModal';
import {
  PlusCircle,
  Layers,
  ShoppingBag,
  TrendingUp,
  Zap,
  ShieldCheck,
  ArrowRight,
  Store,
  DollarSign,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Clock,
  UserCheck,
  RefreshCw,
  Loader2,
  PackagePlus,
} from 'lucide-react';

export default function MerchantDashboardPage() {
  const [shop, setShop] = useState(null);
  const [merchantStatus, setMerchantStatus] = useState('APPROVED');
  const [rejectionReason, setRejectionReason] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [stats, setStats] = useState({
    grossSales: 0,
    activeRacks: 0,
    itemsSold: 0,
    pendingEscrow: 0,
    availablePayout: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch Merchant Status
      try {
        const statusRes = await apiClient.get('/merchant/status');
        if (statusRes.data?.data) {
          setMerchantStatus(statusRes.data.data.merchantStatus || 'UNSUBMITTED');
          setRejectionReason(statusRes.data.data.rejectionReason);
        }
      } catch (e) {
        console.warn('Status fetch fallback:', e);
      }

      // 2. Fetch Shop details
      let currentShop = null;
      try {
        const shopRes = await apiClient.get('/merchant/my-shop');
        if (shopRes.data?.success && shopRes.data?.data) {
          currentShop = shopRes.data.data;
          setShop(currentShop);
        }
      } catch (e) {
        console.warn('Shop fetch fallback:', e);
      }

      // 3. Fetch Stats & Items concurrently with allSettled
      const shopQuery = currentShop?.id ? `?shopId=${currentShop.id}&limit=10&status=ALL` : `?limit=10&status=ALL`;
      const [statsResult, itemsResult] = await Promise.allSettled([
        apiClient.get('/merchant/dashboard-stats'),
        apiClient.get(`/items${shopQuery}`),
      ]);

      if (statsResult.status === 'fulfilled' && statsResult.value?.data?.success && statsResult.value?.data?.data) {
        setStats(statsResult.value.data.data);
      }

      if (itemsResult.status === 'fulfilled' && itemsResult.value?.data?.data) {
        setRecentItems(itemsResult.value.data.data);
      }
    } catch (err) {
      console.warn('Failed to load merchant dashboard details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleItemStatus = async (itemId, currentStatus) => {
    if (currentStatus === 'SOLD') return; // Cannot toggle online sold items

    const nextStatus = currentStatus === 'SOLD_OFFLINE' ? 'AVAILABLE' : 'SOLD_OFFLINE';
    setUpdatingId(itemId);

    try {
      const res = await apiClient.patch(`/items/${itemId}/mark-sold`, { status: nextStatus });
      if (res.data?.success) {
        setToastMessage(
          nextStatus === 'SOLD_OFFLINE'
            ? '✅ Item marked Sold In-Store! KPI Gross Sales & Sold Count updated.'
            : '✅ Item relisted as Available on live rack.'
        );
        setTimeout(() => setToastMessage(null), 3500);

        // Update local items array
        setRecentItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus } : item))
        );

        // Refresh stats dynamically from backend
        const statsRes = await apiClient.get('/merchant/dashboard-stats');
        if (statsRes.data?.success && statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Fallback local calculation
      setRecentItems((prev) => {
        const updated = prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus } : item));
        const active = updated.filter((i) => i.status === 'AVAILABLE').length;
        const sold = updated.filter((i) => i.status === 'SOLD' || i.status === 'SOLD_OFFLINE').length;
        const gross = updated
          .filter((i) => i.status === 'SOLD' || i.status === 'SOLD_OFFLINE')
          .reduce((sum, i) => sum + (i.price || 0), 0);
        setStats((prevStats) => ({
          ...prevStats,
          activeRacks: active,
          itemsSold: sold,
          grossSales: gross,
          availablePayout: Math.round(gross * 0.9),
        }));
        return updated;
      });
      setToastMessage(`Item updated to ${nextStatus === 'SOLD_OFFLINE' ? 'Sold In-Store' : 'Available'}`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  const statCards = [
    {
      title: 'Gross Store Sales',
      value: formatCurrency(stats.grossSales),
      subtitle: 'In-store & online revenue',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Rack Inventory',
      value: `${stats.activeRacks} Items`,
      subtitle: 'Live in digital catalog',
      icon: Layers,
      color: 'text-neon-lime',
      bg: 'bg-neon-lime/10',
    },
    {
      title: 'Total Items Sold',
      value: `${stats.itemsSold} Items`,
      subtitle: 'Walk-ins + online sold',
      icon: ShoppingBag,
      color: 'text-white',
      bg: 'bg-zinc-800',
    },
    {
      title: 'Net Vendor Payout (90%)',
      value: formatCurrency(stats.availablePayout),
      subtitle: '10% platform fee deducted',
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 font-sans max-w-7xl mx-auto">
        <div className="bg-street-card/80 border border-zinc-800 rounded-2xl p-8 h-32 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-street-card/80 border border-zinc-800 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-street-card/80 border border-zinc-800 rounded-2xl h-60 animate-pulse" />
      </div>
    );
  }

  const activeShop = shop || {
    shopName: 'Relic Vintage Co.',
    address: '42 Bandra West, Hill Road',
    city: 'Mumbai',
    isVerified: merchantStatus === 'APPROVED',
  };

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Verification Status Alert Card if not approved */}
      {merchantStatus !== 'APPROVED' && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl backdrop-blur-sm ${
            merchantStatus === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : merchantStatus === 'REJECTED'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              : 'bg-neon-lime/10 border-neon-lime/30 text-zinc-200'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                merchantStatus === 'PENDING'
                  ? 'bg-amber-400/20 text-amber-400'
                  : merchantStatus === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-neon-lime/20 text-neon-lime'
              }`}
            >
              {merchantStatus === 'PENDING' ? (
                <Clock className="w-5 h-5 animate-pulse" />
              ) : merchantStatus === 'REJECTED' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>
                  {merchantStatus === 'PENDING'
                    ? 'Merchant Verification Under Review'
                    : merchantStatus === 'REJECTED'
                    ? 'KYC Verification Needs Correction'
                    : 'Merchant ID Proof Verification Required'}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                    merchantStatus === 'PENDING'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : merchantStatus === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-neon-lime/20 text-neon-lime border border-neon-lime/30'
                  }`}
                >
                  {merchantStatus}
                </span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {merchantStatus === 'PENDING'
                  ? 'Your ID proof document and selfie verification photo are currently being reviewed by the platform admin. You will be able to list items as soon as your account is approved.'
                  : merchantStatus === 'REJECTED'
                  ? `Rejection note: ${rejectionReason || 'Please resubmit valid ID proof document and verification photo.'}`
                  : 'Please complete your merchant KYC (Aadhaar/PAN/Voter/Passport ID proof & selfie photo verification) to get verified by the admin and start selling on UnRetail.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnboardingModal(true)}
            className={`shrink-0 px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 ${
              merchantStatus === 'PENDING'
                ? 'bg-amber-400 text-black hover:bg-white'
                : merchantStatus === 'REJECTED'
                ? 'bg-rose-500 text-white hover:bg-rose-400'
                : 'bg-neon-lime text-black hover:bg-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{merchantStatus === 'PENDING' ? 'View Review Status' : 'Complete Verification'}</span>
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Storefront Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Performance & Inventory Analytics
          </h1>
          <p className="text-xs text-zinc-400">
            {activeShop.shopName} ({activeShop.address}, {activeShop.city}) •{' '}
            {merchantStatus === 'APPROVED' ? 'Verified Boutique Partner' : 'Verification Pending Approval'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white font-semibold text-xs uppercase tracking-wider px-3.5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            title="Sync Live Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-lime' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
          <Link
            href="/dashboard/new-item"
            className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Quick Item Listing
          </Link>
          <Link
            href="/dashboard/listings"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm"
          >
            Rack Inventory
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-3 hover:border-zinc-700 transition-all card-hover-effect shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-medium">{stat.title}</span>
                <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">{stat.value}</div>
              <div className="text-xs text-zinc-500 font-medium">{stat.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <Link
          href="/dashboard/new-item"
          className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect shadow-xl backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neon-lime/10 border border-neon-lime/30 text-neon-lime flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-neon-lime transition-colors">
            Quick Mobile Photo Listing
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Snap photos directly from mobile camera, choose era/condition pills, and publish immediately to live customer
            feeds.
          </p>
          <div className="text-neon-lime font-semibold flex items-center gap-1 pt-1">
            Open Listing Camera <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/listings"
          className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect shadow-xl backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-neon-lime transition-colors">
            Instant In-Store Sold Sync
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Sold an item to a physical walk-in customer? Tap once to instantly toggle status to SOLD and update live catalog
            feeds.
          </p>
          <div className="text-amber-400 font-semibold flex items-center gap-1 pt-1">
            View Rack Inventory <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/orders"
          className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-3 hover:border-neon-lime transition-all group card-hover-effect shadow-xl backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-neon-lime transition-colors">
            Escrow Payouts & Shipping
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Track escrow releases, enter courier tracking numbers, and view clear 90% net vendor payout breakdowns.
          </p>
          <div className="text-emerald-400 font-semibold flex items-center gap-1 pt-1">
            Vendor Orders Rack <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neon-lime text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-black">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Recent Sales & In-Store Sync Rack Table */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 text-xs space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
          <div>
            <span className="font-bold text-white text-sm block">Recent Storefront Sales & Sync Log</span>
            <span className="text-zinc-500 font-medium text-[11px]">
              Tap &quot;Mark Sold&quot; to simulate instant in-store walk-in sale and watch KPI cards update dynamically!
            </span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {recentItems.length} Products on Rack
          </span>
        </div>

        <div className="divide-y divide-zinc-800/70">
          {recentItems.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-zinc-300 font-bold text-sm">No items created on this boutique rack yet</p>
                <p className="text-zinc-500 text-xs">
                  Create your first product listing or load 4 curated starter items to test live KPIs and in-store sync.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSeedStarterCatalog}
                  disabled={seedingLoading}
                  className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {seedingLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading Starter Items...</span>
                    </>
                  ) : (
                    <>
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>Load Starter Boutique Inventory (4 Items)</span>
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard/new-item"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-neon-lime" />
                  <span>Create Custom Item</span>
                </Link>
              </div>
            </div>
          ) : (
            recentItems.map((item) => {
              const isSoldOnline = item.status === 'SOLD';
              const isSoldOffline = item.status === 'SOLD_OFFLINE';
              return (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-semibold hover:bg-zinc-900/40 p-2 rounded-xl transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>{item.title}</span>
                      {isSoldOffline && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
                          SOLD IN-STORE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Item #{item.id.substring(0, 8)} • Size {item.size} • {item.era} • {item.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${
                        item.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-bold text-white text-sm tabular-nums">{formatCurrency(item.price)}</span>
                    <button
                      onClick={() => toggleItemStatus(item.id, item.status)}
                      disabled={updatingId === item.id || isSoldOnline}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                        isSoldOnline
                          ? 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed'
                          : isSoldOffline
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>
                        {updatingId === item.id
                          ? 'Syncing...'
                          : isSoldOnline
                          ? 'Sold Online'
                          : isSoldOffline
                          ? 'Relist Available'
                          : 'Mark Sold'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Merchant Onboarding & KYC Modal */}
      <MerchantOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        currentStatus={merchantStatus}
        onVerificationSubmitted={(data) => {
          setMerchantStatus('PENDING');
          if (data?.user?.shopName) {
            setShop((prev) => ({
              ...prev,
              shopName: data.user.shopName,
              address: data.user.address,
              city: data.user.city,
            }));
          }
        }}
      />
    </div>
  );
}
