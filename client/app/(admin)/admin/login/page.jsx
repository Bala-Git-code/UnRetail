'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, ArrowLeft, Sparkles } from 'lucide-react';
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
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError(err.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-street-card/80 border border-zinc-800/90 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <LogoSymbol size="md" />
            <span className="font-extrabold text-2xl tracking-tight text-white">
              UNRETAIL<span className="text-amber-400">.</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 rounded-full text-xs font-medium text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted Admin Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in with administrative credentials to access platform governance.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px] block">Admin Email</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unretail.in"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white pl-10 pr-3.5 py-3 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px] block">Security Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white pl-10 pr-3.5 py-3 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center">
          <Link
            href="/feed"
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" /> Return To Marketplace Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
