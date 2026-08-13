'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-street-black text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <h1 className="text-6xl font-extrabold text-neon-lime mb-4">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Page Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8 font-sans">
        The streetwear item or page you are looking for does not exist or has been relocated.
      </p>
      <Link 
        href="/"
        className="bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 hover:bg-white transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
      >
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
