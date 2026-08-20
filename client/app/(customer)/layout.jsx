'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, Search, ShoppingBag, Store, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { useCart } from '@/lib/CartContext';

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

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
    { label: 'Catalog Feed', href: '/feed', icon: Flame },
    { label: 'Multi-Filter Search', href: '/search', icon: Search },
    { label: 'My Orders', href: '/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-street-black/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <Logo size="sm" />
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-300">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-zinc-800/90 text-neon-lime shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-neon-lime' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 group cursor-pointer"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-neon-lime transition-colors" />
              <span>Bag</span>
              {cartCount > 0 ? (
                <span className="bg-neon-lime text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full font-mono animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                  {cartCount}
                </span>
              ) : (
                <span className="text-[10px] text-zinc-500 font-mono">0</span>
              )}
            </button>

            <Link
              href="/dashboard"
              className="text-xs font-medium text-zinc-400 hover:text-amber-300 flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 hover:border-amber-400/40 transition-all"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Merchant Portal</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
                <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 rounded-full py-1 px-2.5">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.fullName}
                    className="w-6 h-6 rounded-full border border-zinc-700 object-cover"
                  />
                  <span className="text-xs font-semibold text-zinc-200 max-w-[110px] truncate">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-rose-500/15 border border-zinc-800 hover:border-rose-500/40 text-zinc-300 hover:text-rose-400 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm active:scale-95 group cursor-pointer"
                  title="Log Out of Customer Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                <Link
                  href="/login"
                  className="bg-neon-lime text-black font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-white transition-all shadow-sm active:scale-95"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-rose-500/15 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer"
                  title="Log Out / Reset"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openCart}
              className="relative p-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-neon-lime" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-lime text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-zinc-900/90 hover:bg-rose-500/15 border border-zinc-800 text-zinc-300 hover:text-rose-400 px-2.5 py-1.5 rounded-xl font-semibold text-xs transition-colors"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-street-card/95 backdrop-blur-xl border-b border-zinc-800 p-5 space-y-3 font-sans text-sm animate-fade-in shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-neon-lime font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neon-lime' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-neon-lime" />
              <span>Shopping Bag</span>
            </div>
            <span className="bg-neon-lime text-black font-bold text-xs px-2 py-0.5 rounded-full font-mono">
              {cartCount}
            </span>
          </button>

          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-amber-400 hover:bg-amber-400/10 border-t border-zinc-800/80 pt-3 mt-2"
          >
            <Store className="w-4 h-4" />
            <span>Switch To Merchant Portal</span>
          </Link>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({user.fullName})</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-3 bg-neon-lime text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
