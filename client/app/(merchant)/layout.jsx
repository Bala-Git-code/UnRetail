'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Layers, ShoppingBag, Store, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

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

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Item', href: '/dashboard/new-item', icon: PlusCircle },
    { label: 'Listings', href: '/dashboard/listings', icon: Layers },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col md:flex-row font-sans pb-20 md:pb-0">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-street-card border-r border-zinc-800 flex-col justify-between p-6 shrink-0 sticky top-0 h-screen font-mono text-xs">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neon-lime text-black font-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#ffffff]">
              UR
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter text-white">MERCHANT VENDOR</span>
              <span className="text-[9px] text-neon-lime uppercase tracking-widest">IN-STORE RACK PORTAL</span>
            </div>
          </Link>

          <div className="bg-zinc-950 border border-zinc-800 p-3 flex items-center gap-2.5">
            <Store className="w-4 h-4 text-neon-lime" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] truncate">Relic Vintage Co.</div>
              <div className="text-[10px] text-zinc-500">Mumbai • Verified</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 border font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-neon-lime text-black border-neon-lime shadow-[2px_2px_0px_0px_#ffffff]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-800">
          <Link
            href="/feed"
            className="flex items-center gap-2 text-zinc-400 hover:text-neon-lime transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back To Customer Feed
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-street-black/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-7 h-7 bg-neon-lime text-black font-black flex items-center justify-center text-sm">
              UR
            </div>
            <span className="font-black tracking-tighter text-base text-white">VENDOR PORTAL</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL-TIME RACK SYNC: ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono">
              <div className="text-xs font-bold text-white">{user?.fullName || 'Aarav Patel'}</div>
              <div className="text-[10px] text-zinc-500">Relic Vintage Co. (Mumbai)</div>
            </div>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
            />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-street-card border-t border-zinc-800 px-2 py-2 flex items-center justify-around font-mono text-[10px] uppercase shadow-2xl backdrop-blur-lg select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded transition-all ${
                isActive ? 'text-neon-lime font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-neon-lime' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
