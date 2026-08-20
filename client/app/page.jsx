'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  Store,
  ShieldCheck,
  Tag,
  Zap,
  Search,
  Flame,
  Layers,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LogOut,
  Radio,
  Activity,
  ArrowUpRight,
  Lock,
  RefreshCw,
  RotateCw,
  SlidersHorizontal,
  Compass,
  Check,
  Clock,
  Shirt,
  Camera,
  Cpu,
  BadgeCheck,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useCart } from '@/lib/CartContext';

export default function LandingPage() {
  const { cartCount, openCart } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [user, setUser] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCardFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unretail_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('unretail_token');
      localStorage.removeItem('unretail_user');
      window.location.href = '/login';
    } else {
      setUser(null);
    }
  };

  // Dynamic AI-Generated Thrift Experience Showcase
  const thriftShowcase = [
    {
      id: 'vault',
      title: 'Discover Local Thrift Racks',
      tagline: 'Shop Real Thrift Stores Online • Live In-Store Stock',
      description: 'Explore handpicked vintage gems and pre-loved streetwear directly from local thrift stores. Find one-of-a-kind pieces updated in real-time right from your phone.',
      image: '/images/thrift_local_store.jpg',
      badge: 'Local Thrift Finds',
      badgeColor: 'neon',
      location: 'Local Vintage Boutiques',
      status: 'Live Store Stock Available',
      tags: ['VintageFinds', 'HandpickedRacks', 'LocalThrift', 'UniquePieces'],
      link: '/feed?sort=newest',
      stats: { primary: '100%', primaryLabel: 'Real Store Racks', secondary: 'Instant', secondaryLabel: 'Stock Updates' }
    },
    {
      id: 'curation',
      title: 'Clear Condition Tags & Honest Details',
      tagline: 'Store-Declared Condition Tags • Transparent Flaw Notes',
      description: 'Every item features a designated condition tag provided directly by the thrift seller—from Brand New and Like New to Gently Used. Sellers disclose any wear and tear upfront so you know exactly what to expect.',
      image: '/images/thrift_curation.jpg',
      badge: 'Condition Tagged',
      badgeColor: 'emerald',
      location: 'Seller-Provided Grading',
      status: 'Condition Stated by Seller',
      tags: ['LikeNew', 'GentlyUsed', 'DetailedFlawNotes', 'HonestGrading'],
      link: '/feed?condition=LIKE_NEW',
      stats: { primary: 'Tag-Based', primaryLabel: 'Condition Rating', secondary: 'Detailed', secondaryLabel: 'Photo Transparency' }
    },
    {
      id: 'denim',
      title: 'Find Your Exact Size & Fit',
      tagline: 'Dedicated Size Tags • Pit-to-Pit, Waist & Length Details',
      description: 'Since vintage sizing differs across eras and brands, listings include specific size tags and detailed garment measurements (chest, length, waist) so you always get the right fit.',
      image: '/images/thrift_measurements_tags.jpg',
      badge: 'Size & Fit Tags',
      badgeColor: 'amber',
      location: 'Accurate Garment Dimensions',
      status: 'Exact Measurements Tagged',
      tags: ['SizeTags', 'PitToPit', 'LengthIncluded', 'SizeFilters'],
      link: '/search',
      stats: { primary: 'S to XXL', primaryLabel: 'Size Tagging', secondary: 'Inches/CM', secondaryLabel: 'Exact Sizing' }
    },
    {
      id: 'community',
      title: 'Friendly Support & Worry-Free Shopping',
      tagline: 'Helpful Customer Care • Safe & Secure Escrow Checkout',
      description: 'We make thrift shopping effortless and worry-free. Get friendly support with order questions, easy tracking, and payment escrow that holds your funds securely until your order arrives safely.',
      image: '/images/thrift_friendly_support.jpg',
      badge: 'Friendly Support',
      badgeColor: 'cyan',
      location: 'Dedicated Customer Care',
      status: 'Always Here to Help',
      tags: ['HelpfulSupport', 'EasyTracking', 'EscrowProtected', 'ZeroWorry'],
      link: '/feed',
      stats: { primary: '24/7', primaryLabel: 'Customer Help', secondary: '100%', secondaryLabel: 'Protected Orders' }
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % thriftShowcase.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, thriftShowcase.length]);

  const currentExperience = thriftShowcase[activeTab];

  // User-Friendly Interactive 3D Flip Features
  const platformFeatures = [
    {
      icon: <Radio className="w-5 h-5 text-neon-lime" />,
      tag: 'LIVE INVENTORY',
      badge: 'INSTANT SYNC',
      title: 'Live Store Rack Sync',
      subtitle: 'Real-time store updates',
      frontDescription: 'When a piece sells in a physical boutique, it automatically delists online in less than a second.',
      backTitle: 'Never Miss a Rare Piece',
      backDescription: 'Physical boutique owners scan and sell pieces in their stores daily. The moment a piece is bought in person, our live system instantly syncs the online catalog so you never deal with out-of-stock items or canceled orders.',
      highlights: [
        'Instant real-time stock updates',
        'Zero out-of-stock surprises',
        'Always accurate boutique racks'
      ],
      image: '/images/card_rack_sync.jpg',
      accentBorder: 'border-neon-lime/40',
      accentGlow: 'hover:border-neon-lime hover:shadow-[0_0_30px_rgba(204,255,0,0.15)]',
      accentColor: 'text-neon-lime',
      badgeBg: 'bg-neon-lime/10 text-neon-lime border-neon-lime/30',
      link: '/feed?sort=newest',
      linkText: 'Explore Live Racks'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tag: 'BUYER PROTECTION',
      badge: '100% SAFE',
      title: 'Safe Escrow Checkout',
      subtitle: 'Pay only after you inspect',
      frontDescription: 'Your payment stays safely locked in escrow until your package arrives and you approve the piece.',
      backTitle: 'Your Money is 100% Safe',
      backDescription: 'When you place an order, your payment is held securely in platform escrow. The boutique seller only receives the payout after your order arrives at your doorstep, you open it, inspect the piece, and confirm you love it.',
      highlights: [
        'Funds held securely in escrow',
        'Inspect item before seller gets paid',
        'Full buyer protection on all orders'
      ],
      image: '/images/card_safe_escrow.jpg',
      accentBorder: 'border-emerald-500/40',
      accentGlow: 'hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      link: '/orders',
      linkText: 'Track Escrow Orders'
    },
    {
      icon: <Tag className="w-5 h-5 text-amber-400" />,
      tag: 'HONEST GRADING',
      badge: 'VERIFIED FIT',
      title: 'Honest Condition & Sizing',
      subtitle: 'Exact tape measurements',
      frontDescription: 'Clear condition tags, pit-to-pit garment measurements, and upfront close-up photos of any flaws.',
      backTitle: 'No Guesswork on Fit',
      backDescription: 'Vintage sizing varies across eras and brands. That is why every single listing includes exact tape measurements (chest width, length, waist), a clear condition rating, and close-up photos of any honest wear so you know it fits.',
      highlights: [
        'Exact tape measurements (pit-to-pit)',
        'Upfront wear & flaw transparency',
        'Clear condition ratings (Like New/Used)'
      ],
      image: '/images/card_honest_sizing.jpg',
      accentBorder: 'border-amber-500/40',
      accentGlow: 'hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      link: '/feed?condition=LIKE_NEW',
      linkText: 'Browse Graded Finds'
    },
    {
      icon: <Store className="w-5 h-5 text-cyan-400" />,
      tag: 'LOCAL BOUTIQUES',
      badge: 'PAN-INDIA',
      title: 'Verified Local Boutiques',
      subtitle: 'Real shops from every city',
      frontDescription: 'Discover and support independent brick-and-mortar thrift stores and curated racks nationwide.',
      backTitle: 'Support Local Curators',
      backDescription: 'We connect you directly to independent brick-and-mortar thrift stores and vintage collectors across India. You get access to rare hand-picked racks from independent shops that you will not find on ordinary shopping apps.',
      highlights: [
        'Hand-vetted independent store owners',
        'Rare one-of-a-kind vintage pieces',
        'Direct support for local thrift culture'
      ],
      image: '/images/card_local_boutiques.jpg',
      accentBorder: 'border-cyan-500/40',
      accentGlow: 'hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      accentColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      link: '/feed',
      linkText: 'Discover Boutiques'
    }
  ];

  // Curated 3 Thrift Category Hubs with Dedicated Images
  const categoriesList = [
    {
      name: 'Clothings',
      era: 'Curated Vintage & Streetwear',
      desc: 'Handpicked vintage tees, archival chore jackets, distressed denim, knitwear, and everyday streetwear essentials from verified boutique racks.',
      link: '/search?category=Apparel',
      image: '/images/category_clothings.jpg',
      icon: <Shirt className="w-5 h-5 text-neon-lime" />,
      accentBorder: 'border-neon-lime/30 hover:border-neon-lime',
      tagColor: 'text-neon-lime'
    },
    {
      name: 'Accessories',
      era: 'Archival Accs, Leather & Jewelry',
      desc: 'Solid 925 silver jewelry, vintage leather belts, designer crossbody bags, collectible headwear, eyewear, and curated statement accents.',
      link: '/search?category=Accessories',
      image: '/images/category_accessories.jpg',
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      accentBorder: 'border-amber-500/30 hover:border-amber-400',
      tagColor: 'text-amber-400'
    },
    {
      name: 'Electronic Applications',
      era: 'Retro Digicams & Analog Tech',
      desc: 'Tested Y2K CCD digital cameras, classic handheld gaming consoles, retro cassette players, boomboxes, and verified vintage electronic devices.',
      link: '/search?category=Tech%20%26%20Retro%20Electronics',
      image: '/images/category_electronics.jpg',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      accentBorder: 'border-cyan-500/30 hover:border-cyan-400',
      tagColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans selection:bg-neon-lime selection:text-black overflow-x-hidden">
      {/* Background Ambient Radial Glows & Grid Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-neon-lime/10 via-emerald-500/5 to-transparent rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-[35%] -left-[200px] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] opacity-40" />
        <div className="absolute top-[60%] -right-[200px] w-[650px] h-[650px] bg-neon-lime/5 rounded-full blur-[160px] opacity-35" />
        {/* Subtle Tech Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Sticky High-Gloss Header Nav */}
      <header className="sticky top-0 z-40 bg-street-black/80 backdrop-blur-2xl border-b border-zinc-800/70 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-[1.02] active:scale-98">
            <Logo size="md" showSubtitle taglineText="DECENTRALIZED THRIFT ARCHIVE" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/70 border border-zinc-800/80 rounded-full px-4 py-1.5 backdrop-blur-md shadow-inner text-xs font-semibold text-zinc-300">
            <Link 
              href="/feed" 
              className="px-3.5 py-1.5 rounded-full hover:text-neon-lime hover:bg-zinc-800/80 transition-all flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-neon-lime" /> Live Feed
            </Link>
            <Link 
              href="/search" 
              className="px-3.5 py-1.5 rounded-full hover:text-neon-lime hover:bg-zinc-800/80 transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Multi-Attribute Search
            </Link>
            <Link 
              href="/dashboard" 
              className="px-3.5 py-1.5 rounded-full hover:text-amber-300 hover:bg-zinc-800/80 transition-all flex items-center gap-1.5 text-zinc-400"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" /> Merchant Desk
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Bag Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-zinc-500 rounded-full py-1.5 px-3.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neon-lime" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-neon-lime text-black font-extrabold text-[10px] px-2 py-0.2 rounded-full font-mono animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href={user.role === 'MERCHANT' ? '/dashboard' : '/orders'}
                  className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 rounded-full py-1.5 px-3 transition-all"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.fullName || 'User'}
                    className="w-6 h-6 rounded-full border border-zinc-700 object-cover"
                  />
                  <span className="text-xs font-bold text-zinc-200 max-w-[110px] truncate">
                    {user.fullName || 'My Account'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-zinc-900/80 hover:bg-rose-500/15 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-full font-semibold text-xs transition-all shadow-sm active:scale-95"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_28px_rgba(204,255,0,0.5)] active:scale-95 flex items-center gap-1.5"
              >
                <span>Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Glowing Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 shadow-[0_0_20px_rgba(204,255,0,0.12)] mb-8 transition-transform hover:scale-105">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-lime"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-200 uppercase">
              PHYSICAL STORE RACKS <span className="text-neon-lime">→</span> LIVE THRIFT MARKETPLACE
            </span>
          </div>

          {/* Centered High-Impact Typography */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.96] text-white max-w-5xl">
            Curate to Trust. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-emerald-400 to-cyan-300 drop-shadow-[0_0_40px_rgba(204,255,0,0.28)]">
              The Live Thrift Network.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-zinc-400 text-base sm:text-lg lg:text-xl font-normal max-w-3xl leading-relaxed">
            Discover authentic vintage and streetwear grails straight from independent boutique racks. Explore verified one-of-a-kind pieces updated in real time, with 100% buyer escrow protection.
          </p>

          {/* Centered Dynamic CTA Pill & Search Cluster */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
            <Link
              href="/feed"
              className="w-full sm:w-auto bg-neon-lime hover:bg-white text-black font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_0_40px_rgba(204,255,0,0.6)] active:scale-95 group"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>Explore Live Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-200 hover:text-white font-semibold text-sm uppercase tracking-wider px-7 py-4 rounded-full border border-zinc-700/80 hover:border-zinc-500 flex items-center justify-center gap-2.5 transition-all duration-300 backdrop-blur-md active:scale-95"
            >
              <Store className="w-4 h-4 text-neon-lime" />
              <span>Vendor Quick Listing</span>
            </Link>
          </div>

          {/* Live Micro Metric Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-lime" />
              <span>100% Curated Thrift</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>0.2s Storefront Sync</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Razorpay Escrow Guard</span>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE HERO SHOWCASE */}
          <div className="mt-16 w-full max-w-6xl relative">
            
            {/* Interactive Mode Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {thriftShowcase.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    activeTab === idx
                      ? 'bg-zinc-800 text-white border border-neon-lime shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    activeTab === idx ? 'bg-neon-lime animate-pulse' : 'bg-zinc-600'
                  }`} />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Glass Showcase Container */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-[0_20px_70px_rgba(0,0,0,0.9)] group">
              
              {/* Dynamic Image Layer */}
              <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden">
                <img
                  src={currentExperience.image}
                  alt={currentExperience.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Cinematic Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-street-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-street-black/80 via-transparent to-street-black/60" />

                {/* Top Floating Telemetry & Status Tags */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/75 backdrop-blur-xl border border-zinc-700/80 px-3.5 py-1.5 rounded-full text-xs text-zinc-200 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-neon-lime animate-ping" />
                    <span className="font-mono font-bold tracking-wider">{currentExperience.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-neon-lime text-black font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      {currentExperience.badge}
                    </span>
                  </div>
                </div>

                {/* Showcase Interactive Controls */}
                <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-zinc-700/80 px-3.5 py-2 rounded-full z-20">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-zinc-300 hover:text-neon-lime p-1 transition-colors"
                    title={isPlaying ? 'Pause Experience' : 'Auto Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <div className="h-3 w-px bg-zinc-700" />
                  <button
                    onClick={() => setActiveTab((prev) => (prev - 1 + thriftShowcase.length) % thriftShowcase.length)}
                    className="text-zinc-300 hover:text-white p-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs text-neon-lime font-bold">
                    0{activeTab + 1} / 0{thriftShowcase.length}
                  </span>
                  <button
                    onClick={() => setActiveTab((prev) => (prev + 1) % thriftShowcase.length)}
                    className="text-zinc-300 hover:text-white p-1 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Showcase Content Overlay */}
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-auto max-w-xl z-20 text-left">
                  <div className="text-xs font-mono font-semibold text-neon-lime tracking-widest uppercase mb-1">
                    {currentExperience.tagline}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {currentExperience.title}
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-normal">
                    {currentExperience.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {currentExperience.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono bg-zinc-900/90 border border-zinc-700/80 px-2.5 py-0.5 rounded-md text-zinc-300"
                      >
                        #{t}
                      </span>
                    ))}
                    
                    <Link
                      href={currentExperience.link}
                      className="ml-2 inline-flex items-center gap-1.5 text-xs font-bold text-neon-lime hover:text-white hover:underline transition-colors"
                    >
                      <span>Explore Rack</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Bottom Progress Bar */}
              <div className="w-full bg-zinc-900 h-1">
                <div 
                  className="bg-gradient-to-r from-neon-lime to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((activeTab + 1) / thriftShowcase.length) * 100}%` }}
                />
              </div>

            </div>

          </div>

        </section>

        {/* 3D FLIP CARDS SECTION: User-Friendly Features with Contextual Imagery */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neon-lime uppercase bg-neon-lime/10 px-3 py-1 rounded-full border border-neon-lime/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HOW UNRETAIL WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Real Thrift Shops. <br />
              <span className="text-zinc-400">Zero Guesswork. 100% Safe.</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              We connect real physical vintage boutiques directly to your phone. With instant in-store stock updates, verified tape measurements, and safe escrow protection, shopping authentic thrift has never been easier.
            </p>
          </div>

          {/* Responsive 4-Column 3D Flip Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feat, idx) => {
              const isFlipped = !!flippedCards[idx];

              return (
                <div
                  key={idx}
                  onClick={() => toggleCardFlip(idx)}
                  className={`flip-card-container h-[420px] w-full cursor-pointer select-none ${isFlipped ? 'is-flipped' : ''}`}
                >
                  <div className="flip-card-inner">
                    
                    {/* FRONT OF THE CARD: Contextual Image + Headline + Flip Hint */}
                    <div className="flip-card-front overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col justify-between p-6 shadow-2xl group">
                      
                      {/* Background Contextual Image */}
                      <img
                        src={feat.image}
                        alt={feat.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Multi-Layer Cinematic Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-street-black via-black/75 to-black/45" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />

                      {/* Top Bar: Icon + Badge */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-black/60 border border-zinc-700/80 backdrop-blur-md flex items-center justify-center shadow-lg">
                          {feat.icon}
                        </div>
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md ${feat.badgeBg}`}>
                          {feat.badge}
                        </span>
                      </div>

                      {/* Bottom Front Content */}
                      <div className="relative z-10 space-y-2">
                        <div className={`text-[11px] font-mono font-bold uppercase tracking-widest ${feat.accentColor}`}>
                          {feat.tag}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                          {feat.frontDescription}
                        </p>

                        {/* Card Number Index */}
                        <div className="pt-2 flex items-center justify-end">
                          <span className="text-[11px] font-mono text-zinc-500 font-bold">
                            0{idx + 1}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* BACK OF THE CARD: Clear Friendly Explanation + Benefits */}
                    <div className="flip-card-back overflow-hidden border border-zinc-700/90 bg-gradient-to-br from-zinc-900/98 via-zinc-950/98 to-black p-6 flex flex-col justify-between shadow-2xl backdrop-blur-2xl">
                      
                      {/* Subtle Ambient Radial Accent Glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Back Header */}
                      <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-3">
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${feat.badgeBg}`}>
                          {feat.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white">
                          <RotateCw className="w-3 h-3" /> Flip back
                        </span>
                      </div>

                      {/* Back Core Description & Bullets */}
                      <div className="relative z-10 my-auto py-2 space-y-3">
                        <h4 className="text-lg font-black text-white tracking-tight leading-tight">
                          {feat.backTitle}
                        </h4>
                        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                          {feat.backDescription}
                        </p>

                        {/* Bullet Highlights */}
                        <div className="space-y-1.5 pt-1">
                          {feat.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${feat.accentColor}`} />
                              <span className="leading-tight font-medium">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Back Footer Action */}
                      <div className="relative z-10 pt-3 border-t border-zinc-800/80">
                        <Link
                          href={feat.link}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-neon-lime transition-colors group/link"
                        >
                          <span>{feat.linkText}</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* 3 CATEGORIES SECTION: Displaying 3 Categories with Rich Dedicated Images */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-neon-lime uppercase tracking-widest">
                VERIFIED ARCHIVES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Shop by Category
              </h2>
              <p className="text-zinc-400 text-sm max-w-xl">
                Explore handpicked clothings, curated accessories, and tested electronic applications curated from verified boutique racks.
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-xs font-bold font-mono text-zinc-400 hover:text-neon-lime transition-colors uppercase tracking-wider bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-full"
            >
              <span>Multi-Attribute Search</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Prominent Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categoriesList.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className={`group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${cat.accentBorder}`}
              >
                {/* Visual Banner Header with Category Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                  {/* Top Floating Category Icon */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-10 h-10 rounded-2xl bg-black/70 border border-zinc-700/80 backdrop-blur-md flex items-center justify-center shadow-lg">
                      {cat.icon}
                    </div>
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-zinc-950/80">
                  <div>
                    <div className={`text-[11px] font-mono uppercase tracking-wider mb-1.5 font-bold ${cat.tagColor}`}>
                      {cat.era}
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-neon-lime transition-colors mb-2.5">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Explore Link Indicator */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono font-bold text-zinc-400 group-hover:text-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 group-hover:text-neon-lime transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </section>

      </main>

      {/* MODERN MINIMALIST CLEAN FOOTER (Email form removed from About area) */}
      <footer className="relative z-20 bg-black border-t border-zinc-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-zinc-800/80 items-start">
            
            {/* Left Col: Brand Identity & About Overview */}
            <div className="lg:col-span-6 space-y-4">
              <Link href="/">
                <Logo size="md" showSubtitle taglineText="DECENTRALIZED THRIFT ARCHIVE" />
              </Link>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg font-normal">
                UnRetail connects you directly with verified vintage boutiques and physical thrift racks across India. Discover authentic grails in real time with 100% buyer escrow protection.
              </p>

              {/* Live Escrow System Status Pill */}
              <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
                <span>ESCROW PROTOCOL OPERATIONAL • 99.9% UPTIME</span>
              </div>
            </div>

            {/* Middle Col: Quick Navigation Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                Collector Catalog
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
                <li>
                  <Link href="/feed" className="hover:text-neon-lime transition-colors flex items-center gap-1.5">
                    <span>Live Catalog Feed</span>
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-neon-lime transition-colors">
                    Multi-Attribute Search
                  </Link>
                </li>
                <li>
                  <Link href="/feed?sort=newest" className="hover:text-neon-lime transition-colors">
                    Latest Store Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-neon-lime transition-colors">
                    Track Escrow Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Col: Boutique Portal */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                Boutique Portal
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
                <li>
                  <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
                    Merchant Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/new-item" className="hover:text-amber-300 transition-colors">
                    Quick Listing Tool
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="hover:text-zinc-200 transition-colors">
                    Admin Executive Desk
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-zinc-200 transition-colors">
                    Apply as Boutique Seller
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Protocol Details */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <div>
              © {new Date().getFullYear()} UNRETAIL DECENTRALIZED ARCHIVE. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-4">
              <span>PHYSICAL RACKS • INSTANT DELIST • RAZORPAY ESCROW</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

