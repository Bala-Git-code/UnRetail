'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { ShieldCheck, LayoutDashboard, Store, AlertTriangle, ArrowLeft, LogOut, Lock, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';
import { LogoSymbol } from '@/components/Logo';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // Admin login form states if rendered inline
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    checkAdminAuth();
  }, [pathname]);

  const checkAdminAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('unretail_token');
      const stored = localStorage.getItem('unretail_user');
      if (token && stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed?.role === 'ADMIN') {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (e) {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    }
    setChecking(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await apiClient.post('/auth/admin-login', { email, password });
      if (res.data?.token && res.data?.user) {
        localStorage.setItem('unretail_token', res.data.token);
        localStorage.setItem('unretail_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setAuthorized(true);
      }
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Invalid administrative credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('unretail_token');
    localStorage.removeItem('unretail_user');
    setUser(null);
    setAuthorized(false);
    router.push('/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 flex items-center justify-center text-xs">
        <div className="animate-pulse flex items-center gap-2 text-zinc-400">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="w-full max-w-md bg-street-card/80 border border-amber-500/30 rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-2">
              <LogoSymbol size="lg" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 rounded-full text-xs font-medium text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Executive Access</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Executive Desk Login
            </h2>
            <p className="text-xs text-zinc-400">
              Please enter your authorized administrative credentials to proceed.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
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

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loginLoading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
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

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Executive Top Header */}
      <header className="bg-street-card/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoSymbol size="sm" />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white">Admin Desk</span>
              <span className="text-[10px] text-amber-400 tracking-wider font-semibold uppercase">Executive Platform Desk</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/feed"
            className="text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" /> Marketplace
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold">{user?.fullName || 'System Admin'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 transition-colors"
            title="Sign Out Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">{children}</main>
    </div>
  );
}
