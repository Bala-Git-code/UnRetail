'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, Search, ShoppingBag, Store, UserCheck, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-street-black/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-neon-lime text-black font-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#ffffff]">
                UR
              </div>
              <span className="font-black tracking-tighter text-xl text-white group-hover:text-neon-lime transition-colors">
                UNRETAIL<span className="text-neon-lime">.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <Link
                href="/feed"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === '/feed' ? 'text-neon-lime' : 'hover:text-neon-lime'
                }`}
              >
                <Flame className="w-4 h-4 text-neon-lime" /> Feed
              </Link>
              <Link
                href="/search"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === '/search' ? 'text-neon-lime' : 'hover:text-neon-lime'
                }`}
              >
                <Search className="w-4 h-4" /> Multi-Filter Search
              </Link>
              <Link
                href="/orders"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === '/orders' ? 'text-neon-lime' : 'hover:text-neon-lime'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> My Orders
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 border border-zinc-800 px-3 py-1.5 hover:border-amber-400/50"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" /> Merchant Portal
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full border border-zinc-700 object-cover"
                  />
                  <span className="text-xs font-mono font-bold text-white max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider px-4 py-2 hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-street-card border-b border-zinc-800 p-4 space-y-4 font-mono text-sm uppercase">
          <Link
            href="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-300 hover:text-neon-lime flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-neon-lime" /> Feed
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-300 hover:text-neon-lime flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Multi-Filter Search
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-300 hover:text-neon-lime flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> My Orders
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-400 flex items-center gap-2 border-t border-zinc-800 pt-3"
          >
            <Store className="w-4 h-4" /> Switch To Merchant Portal
          </Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-rose-400 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out ({user.fullName})
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neon-lime"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
