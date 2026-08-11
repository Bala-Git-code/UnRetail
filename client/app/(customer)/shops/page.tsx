'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, MapPin, CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function ShopsDirectoryPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Verified Local Shops Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore independent, physical thrift stores bringing 1-of-1 fashion online.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  {shop.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Shop
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                      Pending Verification
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{shop.shopName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{shop.address}, {shop.city}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>{shop._count?.items || 12} Active Items</span>
                </div>
                <Link
                  href={`/feed?shopId=${shop.id}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  View Inventory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
