import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Store, ShoppingBag, Search, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          The Operating System for Local Thrift & Circular Fashion
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Unify Offline Thrift Inventory into a{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Real-Time Marketplace
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          UnRetail empowers brick-and-mortar vintage shops to list 1-of-1 items in under 60 seconds while providing shoppers with sub-50ms typo-tolerant discovery.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/feed"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Explore Discovery Feed <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/new-item"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400" /> Merchant Desk (60s Listing)
          </Link>
        </div>

        {/* Architecture Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-xs text-slate-400 font-medium">Search Speed</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">&lt; 50ms</p>
            <p className="text-xs text-slate-400 mt-1">Meilisearch Faceted Engine</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-xs text-slate-400 font-medium">Direct Uploads</p>
            <p className="text-xl font-bold text-teal-400 mt-1">Cloudinary CDN</p>
            <p className="text-xs text-slate-400 mt-1">Mobile Direct Photo Upload</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-xs text-slate-400 font-medium">Payments</p>
            <p className="text-xl font-bold text-cyan-400 mt-1">Razorpay</p>
            <p className="text-xs text-slate-400 mt-1">HMAC Signature Webhooks</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-xs text-slate-400 font-medium">Security</p>
            <p className="text-xl font-bold text-amber-400 mt-1">Strict RBAC</p>
            <p className="text-xs text-slate-400 mt-1">Customer / Merchant / Admin</p>
          </div>
        </div>
      </section>

      {/* Triple Portal Feature Matrix */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Triple-Portal Architecture</h2>
            <p className="text-sm text-slate-400 mt-2">Custom tailored user interfaces for every role in the thrift ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Portal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Customer Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Global discovery feed, instant search, era & condition filters, local shop locator, and 1-click Razorpay checkout.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Typo-tolerant search engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Filter by era, size & condition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time order status updates
                </li>
              </ul>
              <Link
                href="/feed"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Go to Discovery Feed <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Merchant Portal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Merchant Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Mobile-first inventory desk enabling shop owners to take photos, set attributes, and list items in under 60 seconds.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 60-second mobile camera upload
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Direct-to-Cloudinary image signing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> In-store offline sync
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
              >
                Launch Merchant Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Admin Portal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Control Desk</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Platform oversight desk for verifying brick-and-mortar shops, monitoring GMV metrics, and resolving customer disputes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Physical shop verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Dispute & refund resolution
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Marketplace volume analytics
                </li>
              </ul>
              <Link
                href="/admin/dashboard"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                Open Admin Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
