'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Filter, Store, Heart, ShoppingBag, Eye, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface ThriftItem {
  id: string;
  title: string;
  description: string;
  category: string;
  era: string;
  size: string;
  condition: string;
  price: number;
  images: string[];
  shop?: {
    shopName: string;
    slug: string;
    city: string;
    isVerified?: boolean;
  };
}

export default function DiscoveryFeedPage() {
  const [items, setItems] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quickViewItem, setQuickViewItem] = useState<ThriftItem | null>(null);

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
      console.warn('API error, using feed prototype items:', err);
      setItems([
        {
          id: 'item-101',
          title: '1990s Vintage Levi 501 Heavyweight Denim',
          description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA with heavyweight 14oz rigid denim.',
          category: 'Apparel',
          era: '90s',
          size: 'W32 L30',
          condition: 'LIKE_NEW',
          price: 68.0,
          images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'],
          shop: { shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', isVerified: true },
        },
        {
          id: 'item-102',
          title: 'Distressed Harley Davidson Leather Jacket',
          description: 'Heavy patina genuine leather bomber jacket from late 80s with original brass zippers and sleeve patches.',
          category: 'Outerwear',
          era: '80s',
          size: 'L',
          condition: 'GENTLY_USED',
          price: 185.0,
          images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'],
          shop: { shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', isVerified: true },
        },
        {
          id: 'item-103',
          title: 'Rare Tour Tee 1994 Band Graphic',
          description: 'Single stitch vintage concert tee from 1994 tour with faded back print.',
          category: 'T-Shirts',
          era: '90s',
          size: 'XL',
          condition: 'GENTLY_USED',
          price: 95.0,
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
          shop: { shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', isVerified: true },
        },
        {
          id: 'item-104',
          title: 'Handcrafted Japanese Indigo Kimono Robe',
          description: 'Authentic Japanese hand-dyed indigo silk kimono robe with gold thread embroidery.',
          category: 'Apparel',
          era: '70s',
          size: 'OS',
          condition: 'LIKE_NEW',
          price: 140.0,
          images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'],
          shop: { shopName: 'Tokyo Thrift Loft', slug: 'tokyo-thrift', city: 'Delhi', isVerified: true },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'Apparel', 'Outerwear', 'T-Shirts', 'Accessories', 'Footwear'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Single-Stock 1-of-1 Thrift Inventory
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Global Discovery Feed</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time inventory synced live from physical thrift racks.</p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
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
            <div key={n} className="h-80 rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5"
            >
              {/* Product Image with Hover Zoom */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Era & Condition Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {item.era || '90s'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-slate-800">
                    {item.size || 'M'}
                  </span>
                </div>

                {/* Quick View Floating Action */}
                <button
                  onClick={() => setQuickViewItem(item)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-slate-950/90 text-slate-200 hover:text-emerald-400 border border-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-300">{item.shop?.shopName || 'Relic Vintage Co.'}</span>
                    {item.shop?.city && <span className="text-slate-500">• {item.shop.city}</span>}
                  </div>
                  <Link href={`/item/${item.id}`}>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-white">₹{item.price}</span>
                  <Link
                    href={`/item/${item.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-400 hover:text-slate-950 transition-all"
                  >
                    View & Buy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Drawer Modal */}
      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setQuickViewItem(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={quickViewItem.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'}
                alt=""
                className="w-full aspect-square object-cover rounded-2xl bg-slate-950 border border-slate-800"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    {quickViewItem.era || '90s'} Vintage
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2">{quickViewItem.title}</h3>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-2">₹{quickViewItem.price}</p>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">{quickViewItem.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <p className="text-slate-400">Shop: <span className="text-white font-semibold">{quickViewItem.shop?.shopName}</span></p>
                    <p className="text-slate-400">Condition: <span className="text-emerald-400 font-semibold">{quickViewItem.condition}</span></p>
                    <p className="text-slate-400">Size: <span className="text-white font-semibold">{quickViewItem.size}</span></p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
                  <Link
                    href={`/item/${quickViewItem.id}`}
                    onClick={() => setQuickViewItem(null)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 font-bold text-slate-950 text-xs text-center hover:opacity-95 shadow-lg shadow-emerald-500/20"
                  >
                    Open Product Page & Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
