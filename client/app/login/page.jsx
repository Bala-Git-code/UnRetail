'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { ShieldCheck, ArrowRight, UserCheck, Store, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleAuth = async (email, fullName, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/google', {
        id_token: 'mock_google_id_token_2026',
        email: email || 'collector@unretail.in',
        fullName: fullName || 'Thrift Collector',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: role || 'CUSTOMER',
      });

      if (response.data?.token) {
        localStorage.setItem('unretail_token', response.data.token);
        localStorage.setItem('unretail_user', JSON.stringify(response.data.user));

        if (response.data.user?.role === 'MERCHANT') {
          router.push('/dashboard');
        } else if (response.data.user?.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/feed');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-center items-center p-4 relative font-sans">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-lime/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Single Card Login Container */}
      <div className="w-full max-w-md bg-street-card border border-zinc-800 p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-neon-lime text-black font-black flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#ffffff]">
              UR
            </div>
            <span className="font-black text-2xl tracking-tighter text-white group-hover:text-neon-lime transition-colors">
              UNRETAIL<span className="text-neon-lime">.</span>
            </span>
          </Link>

          <span className="text-xs font-mono tracking-widest text-neon-lime uppercase bg-neon-lime/10 px-3 py-1 border border-neon-lime/20 mb-2">
            SINGLE-SIGN-ON PORTAL
          </span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Sign In To UnRetail
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Access curated feeds, manage vendor racks, or moderate disputes.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Google Auth Button */}
        <button
          onClick={() => handleGoogleAuth('aarav@relicvintage.in', 'Aarav Patel', 'MERCHANT')}
          disabled={loading}
          className="w-full bg-white text-black font-bold uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-neon-lime transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating...' : 'Sign In With Google'}</span>
        </button>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-street-card px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            OR DEMO ONE-CLICK ENTRY
          </span>
        </div>

        {/* Demo Fast Login Cards */}
        <div className="space-y-3 font-mono text-xs">
          <button
            onClick={() => handleGoogleAuth('collector@unretail.in', 'Thrift Collector', 'CUSTOMER')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold uppercase text-white">Customer Demo</div>
                <div className="text-[10px] text-zinc-500">Browse feed, search & checkout</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleGoogleAuth('aarav@relicvintage.in', 'Aarav Patel', 'MERCHANT')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-neon-lime" />
              <div>
                <div className="font-bold uppercase text-white">Merchant Vendor Demo</div>
                <div className="text-[10px] text-zinc-500">List items, 1-tap in-store sold sync</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleGoogleAuth('admin@unretail.in', 'System Admin', 'ADMIN')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-bold uppercase text-white">Platform Admin Demo</div>
                <div className="text-[10px] text-zinc-500">GMV revenue cut, verify vendors & disputes</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] font-mono text-zinc-500">
          By signing in, you agree to UnRetail&apos;s Escrow Terms and Vendor Marketplace Policies.
        </div>
      </div>
    </div>
  );
}
