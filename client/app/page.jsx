'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { Sparkles, ArrowRight, Store, ShieldCheck, Tag, Zap, Search, ShoppingBag, Flame, Layers, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
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
      conditionTag: 'Pristine • 90s Era',
      shop: 'Relic Vintage Co. (Mumbai)',
      specs: 'W32 L30 • Authentic Denim Patina',
      image: '/images/denim_vintage.png',
    },
    {
      id: 'slide-2',
      title: 'Distressed Harley Davidson Leather Bomber',
      price: 12500,
      conditionTag: 'Gently Loved • 80s Archival',
      shop: 'Retro Vault (Bengaluru)',
      specs: 'Size L • Heavy Aged Grain Leather',
      image: '/images/leather_jacket.png',
    },
    {
      id: 'slide-3',
      title: 'Y2K Stussy Heavyweight Graphic Tee',
      price: 2800,
      conditionTag: 'Pristine • Y2K Grail',
      shop: 'Dust & Gold (Delhi)',
      specs: 'Size XL • Single Stitch Heritage Drop',
      image: '/images/graphic_tee.png',
    },
    {
      id: 'slide-4',
      title: 'Archival Japanese-Release High-Tops',
      price: 8900,
      conditionTag: 'Vintage Character • Footwear',
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
      <div className="bg-neon-lime text-black text-xs font-semibold py-2 px-4 border-b border-black select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="truncate flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Vintage Archive • Connecting Offline Boutiques with Online Collectors</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified In-Store Racks • Razorpay Escrow
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-40 bg-street-black/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Logo size="md" showSubtitle taglineText="THRIFT ARCHIVE" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
            <Link href="/feed" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-neon-lime" /> Catalog Feed
            </Link>
            <Link href="/search" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Multi-Filter Search
            </Link>
            <Link href="/dashboard" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-zinc-400">
              <Store className="w-4 h-4 text-amber-400" /> Merchant Portal
            </Link>
            <Link href="/admin/dashboard" className="hover:text-zinc-200 transition-colors text-zinc-500">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 md:px-8 border-b border-zinc-800/80 overflow-hidden bg-gradient-to-b from-street-black via-zinc-950/80 to-street-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-full text-neon-lime text-xs font-medium">
              <Zap className="w-3.5 h-3.5 fill-neon-lime" />
              <span>Physical Store Racks → Real-Time Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white">
              Archival Grails. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-emerald-400 to-amber-300">
                Live Store Inventory.
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              UnRetail bridges independent vintage boutiques with passionate fashion collectors. Explore verified physical inventory, instant mark-sold rack sync, and secure escrow buyer protection.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/feed"
                className="bg-neon-lime hover:bg-white text-black font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_24px_rgba(204,255,0,0.35)] active:scale-95"
              >
                <span>Explore Live Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/new-item"
                className="bg-zinc-900/90 text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl border border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Store className="w-4 h-4 text-neon-lime" />
                <span>Vendor Quick Listing</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-zinc-400 font-medium">Curated Thrift</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neon-lime">Instant</div>
                <div className="text-xs text-zinc-400 font-medium">Storefront Sync</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">Escrow</div>
                <div className="text-xs text-zinc-400 font-medium">Buyer Protection</div>
              </div>
            </div>
          </div>

          {/* Ambient Fashion Carousel Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden group">
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
                      <span className="bg-neon-lime text-black font-semibold text-xs px-3 py-1 rounded-full shadow-sm">
                        {slide.conditionTag}
                      </span>
                      <span className="text-white font-bold text-xl tabular-nums">
                        {formatCurrency(slide.price)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">
                      Listed by {slide.shop} • {slide.specs}
                    </p>
                  </div>
                </div>
              ))}

              {/* Slide Controls & Carousel Indicators */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700/80 text-xs z-20">
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
                <span className="text-neon-lime font-semibold font-mono text-[11px]">
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
      <section className="py-20 px-4 md:px-8 border-b border-zinc-800/80 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-neon-lime uppercase tracking-wider">
              Curated Catalog Racks
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore By Category
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-zinc-400 hover:text-neon-lime flex items-center gap-2 transition-colors"
          >
            View Multi-Attribute Search <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?category=${encodeURIComponent(cat.name.split(' ')[0])}`}
              className="group relative aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-neon-lime transition-all duration-300 card-hover-effect shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-street-black via-street-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[11px] font-semibold text-neon-lime uppercase tracking-wider mb-1">
                  {cat.era}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-neon-lime transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-zinc-400 mt-1 font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Merchants Teasers */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-800/80 bg-zinc-950/70">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Independent Boutiques
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Verified Store Partners
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-zinc-400 hover:text-amber-300 flex items-center gap-2 transition-colors"
            >
              Partner As A Merchant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all card-hover-effect shadow-xl backdrop-blur-sm"
              >
                <div>
                  <div className="relative h-44 mb-4 rounded-xl overflow-hidden border border-zinc-800">
                    <img
                      src={shop.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'}
                      alt={shop.shopName || shop.name}
                      className="w-full h-full object-cover"
                    />
                    {(shop.isVerified || shop.verified) && (
                      <div className="absolute top-3 right-3 bg-neon-lime text-black text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    {shop.shopName || shop.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-normal">
                    {shop.address}, {shop.city}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-500">{shop._count?.items || shop.itemsCount || 18} Active Listings</span>
                  <Link
                    href={`/feed`}
                    className="text-neon-lime hover:text-white font-semibold flex items-center gap-1 transition-colors"
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
      <footer className="bg-street-black border-t border-zinc-800/80 py-14 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Curated thrift & streetwear marketplace connecting offline boutique racks to verified fashion collectors worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><Link href="/feed" className="hover:text-neon-lime transition-colors">Catalog Feed</Link></li>
              <li><Link href="/search" className="hover:text-neon-lime transition-colors">Multi-Attribute Search</Link></li>
              <li><Link href="/orders" className="hover:text-neon-lime transition-colors">Customer Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Merchant Portal</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><Link href="/dashboard" className="hover:text-amber-300 transition-colors">Vendor Analytics</Link></li>
              <li><Link href="/dashboard/new-item" className="hover:text-amber-300 transition-colors">Quick Listing</Link></li>
              <li><Link href="/dashboard/listings" className="hover:text-amber-300 transition-colors">In-Store Sync</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Admin Desk</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><Link href="/admin/dashboard" className="hover:text-neon-lime transition-colors">Executive Desk</Link></li>
              <li><span className="text-zinc-600">Platform Escrow Protocol</span></li>
              <li><span className="text-zinc-600">Merchant Verification</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-medium">
          <div>© {new Date().getFullYear()} UNRETAIL INC. ALL RIGHTS RESERVED.</div>
          <div>POWERED BY NEXT.JS + PRISMA + RAZORPAY ESCROW</div>
        </div>
      </footer>
    </div>
  );
}
