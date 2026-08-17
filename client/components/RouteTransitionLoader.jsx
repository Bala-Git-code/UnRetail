'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function BrandedOverlayLoader({ message = 'SYNCING CATALOG...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-street-black/90 backdrop-blur-xl select-none"
      style={{ pointerEvents: 'none' }}
    >
      {/* Top Neon Shimmer Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-neon-lime to-transparent animate-pulse" />

      {/* Linked Loops Logo with Breathing Aura */}
      <div className="relative flex flex-col items-center justify-center p-8">
        {/* Ambient Glow Halo */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-40 h-40 rounded-full bg-neon-lime/20 blur-3xl pointer-events-none"
        />

        {/* Silver & Lime Linked Loops SVG Mark */}
        <div className="relative w-28 h-20 mb-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
          <svg
            viewBox="0 0 240 180"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="routeSilver" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#E5E7EB" />
                <stop offset="60%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              <linearGradient id="routeLime" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#CCFF00" />
                <stop offset="80%" stopColor="#84CC16" />
                <stop offset="100%" stopColor="#4D7C0F" />
              </linearGradient>

              <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left Silver Teardrop Loop */}
            <path
              d="M 62,25 C 98,25 125,50 125,86 C 125,122 98,147 62,147 C 32,147 25,125 25,86 C 25,47 32,25 62,25 Z M 62,50 C 45,50 43,65 43,86 C 43,107 45,122 62,122 C 83,122 100,105 100,86 C 100,67 83,50 62,50 Z"
              fill="url(#routeSilver)"
              fillRule="evenodd"
            />

            {/* Right Neon Lime Circular Ring */}
            <path
              d="M 145,25 C 181,25 210,54 210,90 C 210,126 181,155 145,155 C 109,155 80,126 80,90 C 80,54 109,25 145,25 Z M 145,50 C 123,50 105,68 105,90 C 105,112 123,130 145,130 C 167,130 185,112 185,90 C 185,68 167,50 145,50 Z"
              fill="url(#routeLime)"
              fillRule="evenodd"
              filter="url(#routeGlow)"
            />

            {/* 3D Chain Interlocking Overlap */}
            <path
              d="M 85,38 C 98,44 108,55 114,68 C 105,62 95,58 84,56 C 77,55 70,55 62,55 C 62,50 73,39 85,38 Z"
              fill="url(#routeSilver)"
              opacity="0.95"
            />
          </svg>
        </div>

        {/* Text & Status Ticker */}
        <div className="flex flex-col items-center gap-1.5 font-sans">
          <div className="flex items-center gap-2 font-black text-sm tracking-tighter uppercase text-white">
            <span>UNRETAIL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-ping" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-neon-lime uppercase font-semibold drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]">
            {message}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RouteTransitionWatcher({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);
  const timerRef = useRef(null);

  // Trigger on route changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  // Click interceptor for internal navigation links to feel instantaneous
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('/api') &&
        !href.startsWith('#') &&
        target.target !== '_blank'
      ) {
        try {
          const targetUrl = new URL(href, window.location.origin);
          if (targetUrl.pathname !== window.location.pathname) {
            setLoading(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setLoading(false), 450);
          }
        } catch (err) {
          // ignore invalid URLs
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <BrandedOverlayLoader message="LOADING DESTINATION..." />}
      </AnimatePresence>
      {children}
    </>
  );
}

export default function RouteTransitionLoader({ children }) {
  return (
    <Suspense fallback={children}>
      <RouteTransitionWatcher>{children}</RouteTransitionWatcher>
    </Suspense>
  );
}
