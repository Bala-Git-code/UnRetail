'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, ArrowLeft, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { LogoSymbol } from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in as admin
    const storedUser = localStorage.getItem('unretail_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'ADMIN') {
          router.push('/admin/dashboard');
        }
      } catch (e) {}
    }
  }, [router]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post('/auth/admin-login', { email, password });
      if (res.data?.token && res.data?.user) {
        localStorage.setItem('unretail_token', res.data.token);
        localStorage.setItem('unretail_user', JSON.stringify(res.data.user));
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('balagiri702@gmail.com');
    setPassword('0987654321zxcvbnm');
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-between items-center p-6 relative font-sans overflow-hidden selection:bg-amber-400 selection:text-black">
      
      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-400/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-neon-lime/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      {/* Top Navigation */}
      <header className="relative z-20 w-full max-w-5xl flex items-center justify-between py-2">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <LogoSymbol size="sm" />
          <span className="font-black text-lg tracking-tighter text-white group-hover:text-amber-400 transition-colors">
            UNRETAIL<span className="text-amber-400">.</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" /> Customer & Merchant Sign-In
        </Link>
      </header>

      {/* Central Auth Container */}
      <div className="w-full max-w-md luxury-glass rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6 my-auto">
        
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 rounded-full text-xs font-mono font-medium text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span>EXECUTIVE GOVERNANCE DESK</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs font-sans">
            Restricted access portal for platform escrow management, store verifications & dispute resolution.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-2.5 animate-fade-in shadow-lg">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px] block">
              Governance Email
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unretail.in"
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl text-white pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px] block">
              Security Token / Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl text-white pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider py-4 px-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying Admin Session...' : 'Authenticate Platform Admin'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-mono py-2.5 px-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Autofill Governance Credentials</span>
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-zinc-800/80 text-center">
          <Link
            href="/feed"
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" /> Return To Marketplace Catalog
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-3 text-center text-[11px] font-mono text-zinc-600">
        UNRETAIL PLATFORM GOVERNANCE • ENCRYPTED SESSION PROTOCOL
      </footer>
    </div>
  );
}
