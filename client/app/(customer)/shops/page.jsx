'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { Store, ShieldCheck, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/shops');
      if (res.data?.data) {
        setShops(res.data.data);
      }
    } catch (err) {
      console.warn('Shops fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fallbackShops = [
    { id: 'shop-1', shopName: 'Relic Vintage Co.', city: 'Mumbai', isVerified: true, address: '42 Bandra West, Hill Road', _count: { items: 18 } },
    { id: 'shop-2', shopName: 'Retro Vault', city: 'Bengaluru', isVerified: true, address: '108 Indiranagar, 100ft Road', _count: { items: 14 } },
    { id: 'shop-3', shopName: 'Dust & Gold Vintage', city: 'Delhi', isVerified: true, address: '15 Hauz Khas Village', _count: { items: 9 } },
  ];

  const displayShops = shops.length > 0 ? shops : fallbackShops;

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8 pb-6 border-b border-zinc-800/80 space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Physical Boutiques & Racks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verified Thrift Merchants
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Browse verified offline stores powering our real-time online archival catalogue.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-street-card/80 border border-zinc-800 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-street-card/80 border border-zinc-800/90 hover:border-zinc-700/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-sm card-hover-effect"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-neon-lime bg-neon-lime/10 border border-neon-lime/20 px-3 py-0.5 rounded-full">
                    {shop.city}
                  </span>
                  {shop.isVerified && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{shop.shopName}</h3>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> {shop.address}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">{shop._count?.items || 12} Active Listings</span>
                <Link
                  href="/feed"
                  className="text-neon-lime hover:text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  Explore Racks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
