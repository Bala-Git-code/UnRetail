'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Layers, ShoppingBag, TrendingUp, Zap, ShieldCheck, ArrowRight, Store, DollarSign, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function MerchantDashboardPage() {
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    grossSales: 0,
    activeRacks: 0,
    itemsSold: 0,
    pendingEscrow: 0,
    availablePayout: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Shop details
      const shopRes = await apiClient.get('/merchant/my-shop');
      if (shopRes.data?.success && shopRes.data?.data) {
        const shopData = shopRes.data.data;
        setShop(shopData);

        // 2. Fetch Stats & Recent items concurrently
        const [statsRes, itemsRes] = await Promise.all([
          apiClient.get('/merchant/dashboard-stats'),
          apiClient.get(`/items?shopId=${shopData.id}&limit=5&status=ALL`),
        ]);

        if (statsRes.data?.success && statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
        if (itemsRes.data?.success && itemsRes.data?.data) {
          setRecentItems(itemsRes.data.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load merchant dashboard details:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = async (itemId, currentStatus) => {
    if (currentStatus === 'SOLD') return; // Cannot toggle online sold items

    const nextStatus = currentStatus === 'SOLD_OFFLINE' ? 'AVAILABLE' : 'SOLD_OFFLINE';
    setUpdatingId(itemId);

    try {
      const res = await apiClient.patch(`/items/${itemId}/mark-sold`, { status: nextStatus });
      if (res.data?.success) {
        setToastMessage(`Item marked as ${nextStatus === 'SOLD_OFFLINE' ? 'Sold In-Store' : 'Available'}`);
        setTimeout(() => setToastMessage(null), 3000);
        
        // Update local items array
        setRecentItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus } : item))
        );

        // Refresh stats dynamically
        const statsRes = await apiClient.get('/merchant/dashboard-stats');
        if (statsRes.data?.success && statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statCards = [
    { title: 'Gross Store Sales', value: formatCurrency(stats.grossSales), subtitle: 'Dynamic order totals', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Active Rack Inventory', value: `${stats.activeRacks} Items`, subtitle: 'Live in digital catalog', icon: Layers, color: 'text-neon-lime', bg: 'bg-neon-lime/10' },
    { title: 'Total Items Sold', value: `${stats.itemsSold} Items`, subtitle: 'In-store & online combined', icon: ShoppingBag, color: 'text-white', bg: 'bg-zinc-800' },
    { title: 'Net Vendor Payout (90%)', value: formatCurrency(stats.availablePayout), subtitle: 'Platform fee auto-deducted', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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

  const activeShop = shop || { shopName: 'Relic Vintage Co.', address: '42 Bandra West, Hill Road', city: 'Mumbai', isVerified: true };

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans max-w-7xl mx-auto">
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
            {activeShop.shopName} ({activeShop.address}, {activeShop.city}) • {activeShop.isVerified ? 'Verified Boutique Rack' : 'Verification Pending'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            <div key={idx} className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-3 hover:border-zinc-700 transition-all card-hover-effect shadow-xl backdrop-blur-sm">
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
            Snap photos directly from mobile camera, choose era/condition pills, and publish immediately to live customer feeds.
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
            Sold an item to a physical walk-in customer? Tap once to instantly toggle status to SOLD and update live catalog feeds.
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
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="font-bold text-white text-sm">Recent Storefront Sales & Sync Log</span>
          <span className="text-zinc-500 font-medium">Real-Time In-Store Sync</span>
        </div>

        <div className="divide-y divide-zinc-800/70">
          {recentItems.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 font-medium">
              No items created on this rack yet.
            </div>
          ) : (
            recentItems.map((item) => {
              const isSoldOnline = item.status === 'SOLD';
              const isSoldOffline = item.status === 'SOLD_OFFLINE';
              return (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-semibold">
                  <div>
                    <div className="font-semibold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Item #{item.id.substring(0, 8)} • Size {item.size} • {item.era}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                      {item.status}
                    </span>
                    <span className="font-bold text-white text-sm tabular-nums">{formatCurrency(item.price)}</span>
                    <button
                      onClick={() => toggleItemStatus(item.id, item.status)}
                      disabled={updatingId === item.id || isSoldOnline}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shadow-sm active:scale-95 ${
                        isSoldOnline
                          ? 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed'
                          : isSoldOffline
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black'
                      }`}
                    >
                      {updatingId === item.id 
                        ? 'Syncing...' 
                        : isSoldOnline 
                        ? 'Sold Online' 
                        : isSoldOffline 
                        ? 'Mark Available' 
                        : 'Mark Sold'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
