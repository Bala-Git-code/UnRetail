'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, ArrowLeft } from 'lucide-react';
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

      <div className="w-full max-w-md bg-street-card border border-zinc-800 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <LogoSymbol size="md" />
            <span className="font-black text-2xl tracking-tighter text-white">
              UNRETAIL<span className="text-amber-400">.</span>
            </span>
          </Link>

          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 border border-amber-400/30">
            RESTRICTED ADMIN DESK
          </span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Access restricted
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 font-mono text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-bold uppercase block">Admin Email</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unretail.in"
                className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-3 py-3 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-300 font-bold uppercase block">Security Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-3 py-3 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-black font-black text-xs uppercase tracking-widest py-3.5 px-4 hover:bg-white transition-all shadow-[3px_3px_0px_0px_#ffffff] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link
            href="/feed"
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 uppercase inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return To Marketplace Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
