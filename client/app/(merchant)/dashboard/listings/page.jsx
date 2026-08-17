'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition, maskSerialNumber } from '@/lib/utils';
import { isTechCategory } from '@/lib/taxonomy';
import {
  PlusCircle,
  Layers,
  CheckCircle2,
  Tag,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  Zap,
  Trash2,
  Edit3,
  Cpu,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export default function MerchantListingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchMerchantItems();
  }, []);

  const fetchMerchantItems = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/items');
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.warn('Listings fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1-Tap Mark Sold In-Store status toggle
  const handleToggleSoldStatus = async (item) => {
    const newStatus = item.status === 'SOLD' ? 'AVAILABLE' : 'SOLD';
    setUpdatingId(item.id);

    try {
      const res = await apiClient.patch(`/items/${item.id}`, { status: newStatus });
      if (res.data?.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
        );
      }
    } catch (err) {
      console.warn('Status update fallback:', err);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((i) => {
    if (statusFilter === 'ALL') return true;
    return i.status === statusFilter;
  });

  return (
    <div className="p-4 md:p-8 font-sans space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Rack Sync Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory Racks & Listings
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Tap &quot;1-Tap Mark Sold In-Store&quot; to instantly remove items purchased off physical racks from online customer feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/new-item"
            className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add New Item
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs select-none">
        {['ALL', 'AVAILABLE', 'SOLD'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              statusFilter === st
                ? 'bg-neon-lime text-black shadow-[0_0_16px_rgba(204,255,0,0.3)] font-bold'
                : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            {st === 'ALL' ? 'All Rack Items' : st === 'AVAILABLE' ? 'Available Racks' : 'Sold Out'}
          </button>
        ))}
      </div>

      {/* Rack Inventory Table / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-street-card/80 border border-zinc-800 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Inventory Items Found</h3>
          <p className="text-xs text-zinc-400">Add a new item to populate your boutique rack.</p>
        </div>
      ) : (
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl text-xs overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="divide-y divide-zinc-800/70">
            {filteredItems.map((item) => {
              const img = item.images?.[0] || '/images/denim_vintage.png';
              const isSold = item.status === 'SOLD';
              const isTech = isTechCategory(item.category);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shrink-0 relative">
                      <img
                        src={img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/denim_vintage.png';
                        }}
                        className="w-full h-full object-cover"
                      />
                      {isSold && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[10px] font-bold text-rose-400 uppercase tracking-wider backdrop-blur-xs">
                          SOLD
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            isSold
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          }`}
                        >
                          {item.status}
                        </span>

                        {isTech && item.techConditionGrade && (
                          <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> {item.techConditionGrade}
                          </span>
                        )}

                        <span className="text-xs text-zinc-400">
                          {item.category}
                          {item.subcategory && ` • ${item.subcategory}`} • Era: <strong className="text-zinc-300">{item.era || '90s'}</strong>
                        </span>

                        {isTech && item.serialNumberImei && (
                          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                            <Lock className="w-3 h-3 text-cyan-400" />
                            {maskSerialNumber(item.serialNumberImei)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1">{item.title}</h3>
                      <div className="text-base font-bold text-white tabular-nums">{formatCurrency(item.price)}</div>
                    </div>
                  </div>

                  {/* 1-Tap Mark Sold In-Store Action Toggle */}
                  <div className="flex items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                    <button
                      onClick={() => handleToggleSoldStatus(item)}
                      disabled={updatingId === item.id}
                      className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                        isSold
                          ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        {updatingId === item.id
                          ? 'Syncing...'
                          : isSold
                          ? 'Relist Available'
                          : '1-Tap Mark Sold'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
