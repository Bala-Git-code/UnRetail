import Link from 'next/link';
import { Tag, Sparkles, Filter, Store, Heart, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock curated items for feed prototype
const SAMPLE_ITEMS = [
  {
    id: 'item-101',
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    category: 'Apparel',
    condition: 'Excellent',
    price: 68.0,
    shop_name: 'Relic Vintage Co.',
    shop_slug: 'relic-vintage',
    image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
    likes: 24,
  },
  {
    id: 'item-102',
    title: 'Distressed Harley Davidson Leather Jacket',
    category: 'Outerwear',
    condition: 'Good',
    price: 185.0,
    shop_name: 'Retro Vault',
    shop_slug: 'retro-vault',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    likes: 42,
  },
  {
    id: 'item-103',
    title: 'Rare Tour Tee 1994 Band Graphic',
    category: 'T-Shirts',
    condition: 'Mint Vintage',
    price: 95.0,
    shop_name: 'Relic Vintage Co.',
    shop_slug: 'relic-vintage',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    likes: 19,
  },
  {
    id: 'item-104',
    title: 'Handcrafted Japanese Indigo Kimono Robe',
    category: 'Apparel',
    condition: 'Like New',
    price: 140.0,
    shop_name: 'Tokyo Thrift Loft',
    shop_slug: 'tokyo-thrift',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    likes: 31,
  },
  {
    id: 'item-105',
    title: 'Authentic 70s Suede Fringe Shoulder Bag',
    category: 'Accessories',
    condition: 'Good',
    price: 52.0,
    shop_name: 'Dust & Gold Vintage',
    shop_slug: 'dust-and-gold',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    likes: 15,
  },
  {
    id: 'item-106',
    title: 'Original Nike Air Jordan 1 High (1985 Relic)',
    category: 'Footwear',
    condition: 'Fair / Collectors',
    price: 320.0,
    shop_name: 'Kicks & History',
    shop_slug: 'kicks-history',
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    likes: 88,
  },
];

const CATEGORIES = ['All Items', 'Apparel', 'Outerwear', 'T-Shirts', 'Footwear', 'Accessories'];

export default function FeedPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Live Thrift Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Curated Vintage & Pre-Loved Treasures
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Discover one-of-one items uploaded by verified local independent merchants across the globe.
          </p>
        </div>

        <Link
          href="/search"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all"
        >
          <Filter className="w-4 h-4 text-emerald-400" /> Advanced Filter
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              idx === 0
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'glass-card hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-slate-900">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/20 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {item.condition}
              </div>
              <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-red-400 flex items-center justify-center transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <Link
                  href={`/shops`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  <Store className="w-3 h-3" /> {item.shop_name}
                </Link>
                <Link href={`/item/${item.id}`} className="block group-hover:text-emerald-300 transition-colors">
                  <h3 className="font-bold text-slate-100 text-sm line-clamp-1">{item.title}</h3>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-lg font-black text-slate-100">{formatCurrency(item.price)}</span>
                <Link
                  href={`/item/${item.id}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> View Item
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
