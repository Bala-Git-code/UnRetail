'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { Store, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <span className="text-xs font-mono text-neon-lime uppercase tracking-widest">
          PHYSICAL BOUTIQUES & RACKS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Verified Thrift Merchants
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-street-card border border-zinc-800 h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-street-card border border-zinc-800 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-neon-lime uppercase tracking-widest border border-neon-lime/20 px-2 py-0.5">
                    {shop.city}
                  </span>
                  {shop.isVerified && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED VENDOR
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold uppercase text-white tracking-tight">{shop.shopName}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {shop.address}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500">{shop._count?.items || 12} Active Rack Listings</span>
                <Link
                  href="/feed"
                  className="text-neon-lime font-bold uppercase flex items-center gap-1 hover:underline"
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
