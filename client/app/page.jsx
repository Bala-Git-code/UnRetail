'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { Sparkles, ArrowRight, Store, ShieldCheck, Tag, Zap, Search, ShoppingBag, Flame, Layers, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);

  const heroSlides = [
    {
      id: 'slide-1',
      title: '1990s Heavyweight Levi 501 Indigo Wash',
      price: 5499,
      conditionTag: 'PRISTINE // 90s ERA',
      shop: 'Relic Vintage Co. (Mumbai)',
      specs: 'W32 L30 • Authentic Denim Patina',
      image: '/images/denim_vintage.png',
    },
    {
      id: 'slide-2',
      title: 'Distressed Harley Davidson Leather Bomber',
      price: 12500,
      conditionTag: 'GENTLY LOVED // 80s ARCHIVAL',
      shop: 'Retro Vault (Bengaluru)',
      specs: 'Size L • Heavy Aged Grain Leather',
      image: '/images/leather_jacket.png',
    },
    {
      id: 'slide-3',
      title: 'Y2K Stussy Heavyweight Graphic Tee',
      price: 2800,
      conditionTag: 'PRISTINE // Y2K GRAIL',
      shop: 'Dust & Gold (Delhi)',
      specs: 'Size XL • Single Stitch Heritage Drop',
      image: '/images/graphic_tee.png',
    },
    {
      id: 'slide-4',
      title: 'Archival Japanese-Release High-Tops',
      price: 8900,
      conditionTag: 'VINTAGE CHARACTER // FOOTWEAR',
      shop: 'Relic Vintage Co. (Mumbai)',
      specs: 'Size US 10 • Collector Grade Box',
      image: '/images/archival_sneakers.png',
    },
  ];

  const categories = [
    { name: '90s Denim & Jeans', count: '140+ Racks', image: '/images/denim_vintage.png', era: '90s' },
    { name: 'Heavy Outerwear', count: '95+ Racks', image: '/images/leather_jacket.png', era: '80s-90s' },
    { name: 'Graphic Tees', count: '280+ Racks', image: '/images/graphic_tee.png', era: 'Y2K' },
    { name: 'Rare Footwear', count: '60+ Pairs', image: '/images/archival_sneakers.png', era: 'Archival' },
  ];

  const staticShops = [
    {
      id: 'shop-1',
      shopName: 'Relic Vintage Co.',
      city: 'Mumbai',
      address: '42 Bandra West, Hill Road',
      itemsCount: 48,
      isVerified: true,
      image: '/images/vintage_shop.png',
    },
    {
      id: 'shop-2',
      shopName: 'Retro Vault',
      city: 'Bengaluru',
      address: '108 Indiranagar, 100ft Road',
      itemsCount: 62,
      isVerified: true,
      image: '/images/leather_jacket.png',
    },
    {
      id: 'shop-3',
      shopName: 'Dust & Gold Vintage',
      city: 'Delhi',
      address: '15 Hauz Khas Village',
      itemsCount: 31,
      isVerified: false,
      image: '/images/graphic_tee.png',
    },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [shopsRes, itemsRes] = await Promise.all([
        apiClient.get('/shops').catch(() => null),
        apiClient.get('/items').catch(() => null),
      ]);
      if (shopsRes?.data?.data && shopsRes.data.data.length > 0) {
        setShops(shopsRes.data.data);
      }
      if (itemsRes?.data?.data && itemsRes.data.data.length > 0) {
        setItems(itemsRes.data.data);
      }
    } catch (err) {
      console.warn('Landing data fetch fallback:', err);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, heroSlides.length]);

  const activeShops = shops.length > 0 ? shops : staticShops;

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Top Escrow Security Ticker */}
      <div className="bg-neon-lime text-black font-mono text-[11px] font-bold py-1.5 px-4 overflow-hidden border-b border-black select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="truncate">★ LIVE THRIFT ARCHIVE • CONNECTING BOUTIQUES WITH COLLECTORS ★</span>
          <span className="hidden sm:inline">VERIFIED IN-STORE RACKS • ESCROW PROTECTED</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-40 bg-street-black/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Logo size="md" showSubtitle taglineText="THRIFT ARCHIVE" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-zinc-300">
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

      {/* Hero Section with Ambient Fashion Carousel */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 border-b border-zinc-800 overflow-hidden bg-gradient-to-b from-street-black via-zinc-950 to-street-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-neon-lime font-mono text-xs uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-neon-lime" />
              <span>Physical Store Racks → Real-Time Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              Archival Grails. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-emerald-400 to-amber-400">
                Live Store Inventory.
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              UnRetail connects independent vintage boutiques directly with fashion collectors. Explore verified physical inventory, enjoy instant mark-sold sync, and check out securely with buyer protection.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/feed"
                className="bg-neon-lime text-black font-black text-sm uppercase tracking-widest px-8 py-4 flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>Explore Live Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/new-item"
                className="bg-zinc-900 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all"
              >
                <Store className="w-4 h-4 text-neon-lime" />
                <span>Quick Vendor Listing</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800/80 max-w-xl font-mono">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Curated Thrift</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neon-lime">Instant</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Storefront Sync</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">Escrow</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Buyer Protection</div>
              </div>
            </div>
          </div>

          {/* Ambient Fashion Carousel Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-zinc-900 border-2 border-zinc-700 shadow-2xl overflow-hidden group">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-neon-lime text-black font-mono font-bold text-xs px-2.5 py-1">
                        {slide.conditionTag}
                      </span>
                      <span className="text-white font-mono font-black text-xl">
                        {formatCurrency(slide.price)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-1">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      Listed by {slide.shop} • {slide.specs}
                    </p>
                  </div>
                </div>
              ))}

              {/* Slide Controls & Carousel Indicators */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 border border-zinc-700 font-mono text-xs z-20">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-zinc-300 hover:text-neon-lime p-1"
                  title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="text-zinc-300 hover:text-white p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-neon-lime font-bold">
                  0{currentSlide + 1} / 0{heroSlides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="text-zinc-300 hover:text-white p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Carousel Pill Dots */}
              <div className="absolute bottom-3 left-6 flex items-center gap-1.5 z-20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlide ? 'w-6 bg-neon-lime' : 'w-2 bg-zinc-600'
                    }`}
                  />
                ))}
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
              CURATED CATALOG
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Explore By Category
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-neon-lime flex items-center gap-2"
          >
            View Multi-Attribute Search <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?category=${encodeURIComponent(cat.name.split(' ')[0])}`}
              className="group relative aspect-[3/4] bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-neon-lime transition-all duration-300 card-hover-effect"
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
                Verified Store Partners
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-amber-400 flex items-center gap-2"
            >
              Partner As A Merchant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-street-card border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-600 transition-all card-hover-effect"
              >
                <div>
                  <div className="relative h-44 mb-4 overflow-hidden border border-zinc-800">
                    <img
                      src={shop.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'}
                      alt={shop.shopName || shop.name}
                      className="w-full h-full object-cover"
                    />
                    {(shop.isVerified || shop.verified) && (
                      <div className="absolute top-3 right-3 bg-neon-lime text-black font-mono text-[10px] font-extrabold uppercase px-2 py-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED STORE
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    {shop.shopName || shop.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    {shop.address}, {shop.city}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400">{shop._count?.items || shop.itemsCount || 18} Active Listings</span>
                  <Link
                    href={`/feed`}
                    className="text-neon-lime font-bold uppercase hover:underline flex items-center gap-1"
                  >
                    View Racks <ArrowRight className="w-3 h-3" />
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
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Archival thrift & streetwear marketplace connecting offline boutique racks to verified online collectors.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/feed" className="hover:text-neon-lime">Catalog Feed</Link></li>
              <li><Link href="/search" className="hover:text-neon-lime">Multi-Attribute Search</Link></li>
              <li><Link href="/orders" className="hover:text-neon-lime">Customer Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Merchant Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/dashboard" className="hover:text-neon-lime">Vendor Analytics</Link></li>
              <li><Link href="/dashboard/new-item" className="hover:text-neon-lime">Quick Listing</Link></li>
              <li><Link href="/dashboard/listings" className="hover:text-neon-lime">In-Store Sync</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Admin Desk</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/admin/dashboard" className="hover:text-neon-lime">Executive Desk</Link></li>
              <li><span className="text-zinc-600">Platform Service Fee</span></li>
              <li><span className="text-zinc-600">Merchant Verification Desk</span></li>
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

