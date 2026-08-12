'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, Store, AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
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

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans">
      {/* Executive Top Header */}
      <header className="bg-street-card border-b border-zinc-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-400 text-black font-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#ffffff]">
              UR
            </div>
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
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">{children}</main>
    </div>
  );
}
