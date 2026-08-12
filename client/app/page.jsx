'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Store, ShieldCheck, Tag, Zap, Search, ShoppingBag, Flame, Layers } from 'lucide-react';

export default function LandingPage() {
  const categories = [
    { name: '90s Denim & Levi 501', count: '140+ Racks', image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80', era: '90s' },
    { name: 'Heavy Outerwear', count: '95+ Racks', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', era: '80s-90s' },
    { name: 'Graphic Tees', count: '280+ Racks', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', era: 'Y2K' },
    { name: 'Rare Footwear', count: '60+ Pairs', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80', era: 'Archival' },
  ];

  const featuredShops = [
    {
      id: 'shop-1',
      name: 'Relic Vintage Co.',
      city: 'Mumbai',
      address: '42 Bandra West, Hill Road',
      itemsCount: 48,
      verified: true,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'shop-2',
      name: 'Retro Vault',
      city: 'Bengaluru',
      address: '108 Indiranagar, 100ft Road',
      itemsCount: 62,
      verified: true,
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'shop-3',
      name: 'Dust & Gold Vintage',
      city: 'Delhi',
      address: '15 Hauz Khas Village',
      itemsCount: 31,
      verified: false,
      image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Top Ticker Marquee */}
      <div className="bg-neon-lime text-black font-black text-xs uppercase tracking-widest py-2 overflow-hidden border-b border-black select-none">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          <span>★ UNRETAIL: MULTI-VENDOR ARCHIVAL THRIFT MARKETPLACE</span>
          <span>★ REAL-TIME IN-STORE RACK INVENTORY</span>
          <span>★ 1-TAP IN-STORE SOLD SYNC FOR MERCHANTS</span>
          <span>★ SECURE RAZORPAY PAYMENT & DISPUTE PROTECTION</span>
          <span>★ UNRETAIL: MULTI-VENDOR ARCHIVAL THRIFT MARKETPLACE</span>
          <span>★ REAL-TIME IN-STORE RACK INVENTORY</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-40 bg-street-black/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-neon-lime text-black font-black flex items-center justify-center text-xl tracking-tighter shadow-[3px_3px_0px_0px_#ffffff]">
              UR
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-2xl leading-none text-white group-hover:text-neon-lime transition-colors">
                UNRETAIL<span className="text-neon-lime">.</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                THRIFT ARCHIVE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider text-zinc-300">
            <Link href="/feed" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-neon-lime" /> Catalog Feed
            </Link>
            <Link href="/search" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Multi-Filter Search
            </Link>
            <Link href="/dashboard" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
              <Store className="w-4 h-4" /> Merchant Portal
            </Link>
            <Link href="/admin/dashboard" className="hover:text-neon-lime transition-colors text-zinc-400">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 hover:bg-white transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-0.5 active:translate-y-0.5"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 border-b border-zinc-800 overflow-hidden bg-gradient-to-b from-street-black via-zinc-950 to-street-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-neon-lime font-mono text-xs uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-neon-lime" />
              <span>Fragmented Physical Racks → Live Digital Feed</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              Archival Grails. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-emerald-400 to-amber-400">
                Real-Time Racks.
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              UnRetail connects independent vintage boutiques and thrift merchants directly to street culture collectors. Verified inventory, instant in-store mark-sold sync, and safe escrow checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/feed"
                className="bg-neon-lime text-black font-black text-sm uppercase tracking-widest px-8 py-4 flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>Browse Live Racks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/new-item"
                className="bg-zinc-900 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all"
              >
                <Store className="w-4 h-4 text-neon-lime" />
                <span>60-Sec Merchant Listing</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800/80 max-w-xl font-mono">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Authentic Thrift</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neon-lime">1-Tap</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">In-Store Sync</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">10%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Platform Take</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-zinc-900 border-2 border-zinc-700 shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80"
                alt="Vintage 90s Levi Denim"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-neon-lime text-black font-mono font-bold text-xs px-2.5 py-1">
                    LIKE NEW // 90s ERA
                  </span>
                  <span className="text-white font-mono font-black text-xl">₹5,499</span>
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  1990s Vintage Heavyweight Levi 501 Indigo Wash
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Listed by Relic Vintage Co. (Mumbai) • W32 L30
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="py-16 px-4 md:px-8 border-b border-zinc-800 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-neon-lime uppercase tracking-widest mb-1">
              CURATED CATALOGUE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Explore By Category
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-neon-lime flex items-center gap-2"
          >
            View All Multi-Filter Search <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?category=${encodeURIComponent(cat.name.split(' ')[0])}`}
              className="group relative aspect-[3/4] bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-neon-lime transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-street-black via-street-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[11px] font-mono text-neon-lime tracking-widest uppercase mb-1">
                  {cat.era}
                </span>
                <h3 className="text-xl font-black uppercase text-white group-hover:text-neon-lime transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400 mt-1">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Merchants Teasers */}
      <section className="py-16 px-4 md:px-8 border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                INDEPENDENT BOUTIQUES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Verified Thrift Merchants
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-amber-400 flex items-center gap-2"
            >
              Partner As A Vendor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-street-card border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-600 transition-all"
              >
                <div>
                  <div className="relative h-44 mb-4 overflow-hidden border border-zinc-800">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    {shop.verified && (
                      <div className="absolute top-3 right-3 bg-neon-lime text-black font-mono text-[10px] font-extrabold uppercase px-2 py-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED VENDOR
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    {shop.address}, {shop.city}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400">{shop.itemsCount} Active Listings</span>
                  <Link
                    href={`/feed`}
                    className="text-neon-lime font-bold uppercase hover:underline flex items-center gap-1"
                  >
                    Explore Shop <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-street-black border-t border-zinc-800 py-12 px-4 md:px-8 mt-auto font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neon-lime text-black font-black flex items-center justify-center text-sm">
                UR
              </div>
              <span className="font-black tracking-tighter text-xl text-white">UNRETAIL</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Multi-vendor thrift & archival streetwear marketplace. Connecting physical inventory racks to live digital feeds.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/feed" className="hover:text-neon-lime">Catalog Feed</Link></li>
              <li><Link href="/search" className="hover:text-neon-lime">Multi-Attribute Search</Link></li>
              <li><Link href="/orders" className="hover:text-neon-lime">Customer Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Merchant Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/dashboard" className="hover:text-neon-lime">Vendor Analytics</Link></li>
              <li><Link href="/dashboard/new-item" className="hover:text-neon-lime">60-Sec Listing Flow</Link></li>
              <li><Link href="/dashboard/listings" className="hover:text-neon-lime">1-Tap In-Store Sync</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Admin Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/admin/dashboard" className="hover:text-neon-lime">Executive Dashboard</Link></li>
              <li><span className="text-zinc-600">10% Platform Cut Escrow</span></li>
              <li><span className="text-zinc-600">Vendor Verification Desk</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600">
          <div>© {new Date().getFullYear()} UNRETAIL INC. ALL RIGHTS RESERVED.</div>
          <div>POWERED BY NODE.JS + EXPRESS + PRISMA</div>
        </div>
      </footer>
    </div>
  );
}
