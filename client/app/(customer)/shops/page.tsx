import Link from 'next/link';
import { Store, MapPin, Sparkles, Package, ArrowRight, ShieldCheck } from 'lucide-react';

const SHOPS_DIRECTORY = [
  {
    id: 'shop-1',
    name: 'Relic Vintage Co.',
    slug: 'relic-vintage',
    description: 'Specializing in 80s & 90s band tees, rare denim, and iconic American workwear.',
    location: 'Portland, OR',
    active_items: 42,
    verified: true,
    cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'shop-2',
    name: 'Retro Vault',
    slug: 'retro-vault',
    description: 'Heavyweight leather outerwear, motorcycle jackets, and authentic vintage boots.',
    location: 'Austin, TX',
    active_items: 28,
    verified: true,
    cover_image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'shop-3',
    name: 'Tokyo Thrift Loft',
    slug: 'tokyo-thrift',
    description: 'Japanese streetwear relics, vintage kimonos, and rare archival designer pieces.',
    location: 'Seattle, WA',
    active_items: 65,
    verified: true,
    cover_image: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=600&q=80',
  },
];

export default function ShopsDirectoryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
          <Store className="w-3.5 h-3.5" /> Merchant Directory
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Independent Thrift Storefronts</h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Support local thrifters and vintage curators. Each shop manages its own inventory and guarantees authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SHOPS_DIRECTORY.map((shop) => (
          <div
            key={shop.id}
            className="glass-card rounded-3xl border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="relative h-40 overflow-hidden bg-slate-900">
              <img
                src={shop.cover_image}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              {shop.verified && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Shop
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between -mt-6 relative z-10">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-100">{shop.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {shop.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-amber-400" /> {shop.active_items} items
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{shop.description}</p>
              </div>

              <button className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                Visit Storefront <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
