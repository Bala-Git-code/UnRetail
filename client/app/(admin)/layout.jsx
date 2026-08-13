'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { ShieldCheck, LayoutDashboard, Store, AlertTriangle, ArrowLeft, LogOut, Lock, KeyRound, ShieldAlert } from 'lucide-react';

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

  // Skip guard check on explicit admin login page route
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 flex items-center justify-center font-mono text-xs">
        <div className="animate-pulse">Verifying Admin Permissions...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="w-full max-w-md bg-street-card border border-amber-500/40 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-2">
              <LogoSymbol size="lg" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 border border-amber-400/30 inline-block">
              RESTRICTED ADMIN ACCESS
            </span>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">
              Executive Desk Login Required
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Access restricted
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 font-mono text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
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

            <div className="space-y-1">
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

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-400 text-black font-black text-xs uppercase tracking-widest py-3.5 px-4 hover:bg-white transition-all shadow-[3px_3px_0px_0px_#ffffff] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loginLoading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center">
            <Link
              href="/feed"
              className="text-[11px] font-mono text-zinc-400 hover:text-white uppercase inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return To Marketplace Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Executive Top Header */}
      <header className="bg-street-card border-b border-zinc-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoSymbol size="sm" />
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-xl text-white">ADMIN DESK</span>
              <span className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">EXECUTIVE PLATFORM DESK</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <Link
            href="/feed"
            className="text-zinc-400 hover:text-white flex items-center gap-1 border border-zinc-800 px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Main Marketplace
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-white font-bold">{user?.fullName || 'System Admin'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 border border-zinc-800 px-2.5 py-1.5"
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

