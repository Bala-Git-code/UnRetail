import Link from 'next/link';
import { ShoppingBag, Store, ShieldCheck, Sparkles, ArrowRight, Tag, RefreshCw } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-amber-500/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              U
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              UNRETAIL
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Explore Feed
            </Link>
            <Link
              href="/shops"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Shops
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/select-role"
              className="px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            The Multi-Vendor Thrift & Vintage Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Thrift Unique Style.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Empower Local Merchants.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            Unretail connects eco-conscious shoppers directly with curated vintage boutiques and local thrifters. Sell in under 60 seconds or discover one-of-a-kind treasures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/feed"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-base"
            >
              <ShoppingBag className="w-5 h-5" /> Start Shopping
            </Link>
            <Link
              href="/select-role?role=merchant"
              className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-slate-800/80 text-slate-100 font-bold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Store className="w-5 h-5 text-amber-400" /> Open a Thrift Shop
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="glass-card p-8 rounded-3xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">60-Second Listings</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Merchants can list vintage & thrift items instantly with automatic background search indexing and tag generation.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Sustainable Discovery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Support circular fashion. Explore verified local thrift shops, filter by condition, price range, and custom styles.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Protected Orders</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Secure buyer protection, instant merchant payouts via Stripe, and end-to-end status tracking on every order.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Unretail Multi-Vendor Marketplace © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/feed" className="hover:text-slate-300 transition-colors">Feed</Link>
            <Link href="/shops" className="hover:text-slate-300 transition-colors">Shops</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
