'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Layers, ShoppingBag, Store, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { LogoSymbol } from '@/components/Logo';

export default function MerchantLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unretail_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
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
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Item', href: '/dashboard/new-item', icon: PlusCircle },
    { label: 'Listings', href: '/dashboard/listings', icon: Layers },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col md:flex-row font-sans pb-20 md:pb-0">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-street-card/90 border-r border-zinc-800/80 flex-col justify-between p-6 shrink-0 sticky top-0 h-screen text-xs shadow-2xl backdrop-blur-xl">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoSymbol size="sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white">Merchant Portal</span>
              <span className="text-[10px] text-neon-lime uppercase tracking-wider font-semibold">Storefront Sync</span>
            </div>
          </Link>

          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center text-neon-lime shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-xs truncate">
                {user?.shopName || 'Boutique Store'}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <span>{user?.city || 'India'}</span>
                <span>•</span>
                <span className={user?.merchantStatus === 'APPROVED' || user?.role === 'ADMIN' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {user?.merchantStatus === 'APPROVED' || user?.role === 'ADMIN' ? 'Verified' : 'Under Review'}
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-neon-lime text-black shadow-[0_0_16px_rgba(204,255,0,0.3)] font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/feed"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-zinc-900/50"
          >
            <ArrowLeft className="w-4 h-4 text-neon-lime" /> Back to Catalog Feed
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-zinc-400 hover:text-rose-400 transition-colors text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer text-left group"
          >
            <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 transition-colors" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-street-black/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <LogoSymbol size="xs" />
            <span className="font-bold text-sm text-white">Merchant Portal</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span className={`w-2 h-2 rounded-full ${user?.merchantStatus === 'APPROVED' || user?.role === 'ADMIN' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>
              Storefront Status:{' '}
              <strong className={user?.merchantStatus === 'APPROVED' || user?.role === 'ADMIN' ? 'text-emerald-400' : 'text-amber-400'}>
                {user?.merchantStatus === 'APPROVED' || user?.role === 'ADMIN' ? 'ACTIVE & VERIFIED' : 'PENDING ADMIN APPROVAL'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user?.fullName || 'Boutique Merchant'}</div>
              <div className="text-[11px] text-zinc-500 font-medium">
                {user?.shopName || 'Boutique Store'} ({user?.city || 'India'})
              </div>
            </div>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-rose-500/15 border border-zinc-800 hover:border-rose-500/40 text-zinc-300 hover:text-rose-400 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm active:scale-95 group cursor-pointer"
              title="Log Out of Merchant Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-street-card/95 border-t border-zinc-800 px-3 py-2 flex items-center justify-around text-xs shadow-2xl backdrop-blur-xl select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-neon-lime font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
