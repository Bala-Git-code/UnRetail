import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Store, ShoppingBag, Search, CheckCircle2, Flame, MapPin, Tag } from 'lucide-react';

export default function LandingPage() {
  const categories = [
    { title: '90s Denim & Levi 501s', count: '142 pieces', image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80', tag: '90s' },
    { title: 'Distressed Leather Bombers', count: '89 pieces', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', tag: '80s' },
    { title: 'Rare Tour Graphic Tees', count: '210 pieces', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', tag: 'Vintage' },
    { title: 'Japanese Kimonos & Silk', count: '54 pieces', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', tag: 'Rare' },
    { title: 'Suede Fringe & Retro Bags', count: '76 pieces', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', tag: '70s' },
    { title: 'Heavyweight Utility Workwear', count: '118 pieces', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', tag: 'Utility' },
  ];

  const featuredShops = [
    { name: 'Relic Vintage Co.', city: 'Mumbai', address: '42 Bandra West', items: 18, verified: true },
    { name: 'Retro Vault', city: 'Bengaluru', address: '108 Indiranagar', items: 24, verified: true },
    { name: 'Dust & Gold Vintage', city: 'Delhi', address: '15 Hauz Khas', items: 9, verified: true },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          The Operating System for Offline Thrift & Circular Fashion
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Discover 1-of-1 Vintage & Thrifted Finds from{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Local Physical Shops
          </span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          UnRetail unifies fragmented, offline thrift store inventories into a real-time online marketplace. Shop single-stock gems with sub-50ms typo-tolerant search or launch your shop in 60 seconds.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/feed"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 text-sm"
          >
            <ShoppingBag className="w-5 h-5" /> Start Shopping (Global Feed)
          </Link>
          <Link
            href="/dashboard/new-item"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-200 bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm text-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400" /> Open a Store (Snap & Sell in 60s)
          </Link>
        </div>

        {/* Live Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Typo-Tolerant Search</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">&lt; 50ms</p>
            <p className="text-[11px] text-slate-400 mt-1">Meilisearch Faceted Engine</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Direct Photo Upload</p>
            <p className="text-2xl font-extrabold text-teal-400 mt-1">Cloudinary</p>
            <p className="text-[11px] text-slate-400 mt-1">Direct Signed Camera Feed</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Payment Gateway</p>
            <p className="text-2xl font-extrabold text-cyan-400 mt-1">Razorpay</p>
            <p className="text-[11px] text-slate-400 mt-1">HMAC Signature Protection</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Portal Security</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">Strict RBAC</p>
            <p className="text-[11px] text-slate-400 mt-1">Customer / Merchant / Admin</p>
          </div>
        </div>
      </section>

      {/* Category Grid: "Find Local Vintage" */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
                <Flame className="w-3.5 h-3.5" /> Curated Categories
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Find Local Vintage</h2>
            </div>
            <Link href="/search" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-2 md:mt-0 flex items-center gap-1">
              Browse All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/search?category=${encodeURIComponent(cat.title.split(' ')[0])}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-end p-6"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="relative z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 mb-2 inline-block">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">{cat.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Physical Thrift Shops */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Verified Brick-and-Mortar Shops</h2>
            <p className="text-xs text-slate-400 mt-2">Connecting physical store racks directly to your screen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredShops.map((shop, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    {shop.name} <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {shop.address}, {shop.city}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">{shop.items} Active Gems</span>
                  <Link href="/feed" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    View Rack &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
