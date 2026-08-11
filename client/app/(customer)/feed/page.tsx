'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Filter, Store, Heart, ShoppingBag, Search } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface ThriftItem {
  id: string;
  title: string;
  category: string;
  era: string;
  condition: string;
  price: number;
  images: string[];
  shop?: {
    shopName: string;
    slug: string;
    city: string;
  };
}

export default function DiscoveryFeedPage() {
  const [items, setItems] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchFeedItems();
  }, [selectedCategory]);

  const fetchFeedItems = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : '';
      const response = await apiClient.get(`/items${categoryParam}`);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (err) {
      console.warn('API error, loading fallback feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'Apparel', 'Outerwear', 'T-Shirts', 'Accessories', 'Footwear'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated 1-of-1 Thrift Finds
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Discovery Feed</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time inventory directly synced from local physical thrift shops.</p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {item.era || 'Vintage'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-slate-800">
                    {item.condition ? item.condition.replace('_', ' ') : 'LIKE NEW'}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                    <Store className="w-3 h-3 text-emerald-400" />
                    <span>{item.shop?.shopName || 'Relic Vintage Co.'}</span>
                    {item.shop?.city && <span className="text-slate-500">• {item.shop.city}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-white">₹{item.price}</span>
                  <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
