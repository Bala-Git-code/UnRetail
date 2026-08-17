'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LogoSymbol } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-street-black text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-6">
      <LogoSymbol size="lg" />
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold text-neon-lime tracking-tight">404</h1>
        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
          The streetwear grail or rack catalog page you are looking for does not exist or has been relocated.
        </p>
      </div>
      <Link 
        href="/"
        className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
}
