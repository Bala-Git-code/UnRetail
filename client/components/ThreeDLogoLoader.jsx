'use client';

import React from 'react';

/**
 * Sleek Flashing 3D Logo Spinner / Loading Bar for route changes & page loads.
 * Features an interlocking 3D emblem with metallic chrome highlights and glowing neon lime ring.
 */
export default function ThreeDLogoLoader({
  message = 'LOADING UNRETAIL...',
  fullscreen = false,
  compact = true,
}) {
  if (compact && !fullscreen) {
    return (
      <div 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in"
        style={{ zIndex: 9999 }}
      >
        <div 
          className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-zinc-800 shadow-2xl backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(9, 9, 11, 0.92)', color: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}
        >
          {/* Flashing 3D Emblem Symbol */}
          <div className="relative w-7 h-5 animate-pulse">
            <svg
              viewBox="0 0 240 180"
              className="w-full h-full drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flashSilver" x1="10%" y1="10%" x2="90%" y2="90%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#9CA3AF" />
                  <stop offset="100%" stopColor="#1F2937" />
                </linearGradient>

                <linearGradient id="flashLime" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#CCFF00" />
                  <stop offset="100%" stopColor="#65A30D" />
                </linearGradient>
              </defs>

              {/* Silver Teardrop Loop */}
              <path
                d="M 62,25 C 98,25 125,50 125,86 C 125,122 98,147 62,147 C 32,147 25,125 25,86 C 25,47 32,25 62,25 Z M 62,50 C 45,50 43,65 43,86 C 43,107 45,122 62,122 C 83,122 100,105 100,86 C 100,67 83,50 62,50 Z"
                fill="url(#flashSilver)"
                fillRule="evenodd"
              />

              {/* Neon Lime Ring */}
              <path
                d="M 145,25 C 181,25 210,54 210,90 C 210,126 181,155 145,155 C 109,155 80,126 80,90 C 80,54 109,25 145,25 Z M 145,50 C 123,50 105,68 105,90 C 105,112 123,130 145,130 C 167,130 185,112 185,90 C 185,68 167,50 145,50 Z"
                fill="url(#flashLime)"
                fillRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-black text-xs tracking-tighter uppercase font-sans text-white">
              <span>UNRETAIL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-ping" />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-neon-lime uppercase">
              {message}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none"
      style={{ backgroundColor: '#09090b', color: '#ffffff', zIndex: 9999 }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center [perspective:1000px]">
        <div className="relative w-40 h-40 flex items-center justify-center [transform-style:preserve-3d] animate-[spin3d_5s_ease-in-out_infinite]">
          <div className="absolute inset-0 rounded-full bg-neon-lime/10 blur-xl animate-pulse" />

          <svg
            viewBox="0 0 240 180"
            className="w-full h-full drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fullSilver" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              <linearGradient id="fullLime" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#CCFF00" />
                <stop offset="100%" stopColor="#65A30D" />
              </linearGradient>
            </defs>

            <path
              d="M 62,25 C 98,25 125,50 125,86 C 125,122 98,147 62,147 C 32,147 25,125 25,86 C 25,47 32,25 62,25 Z M 62,50 C 45,50 43,65 43,86 C 43,107 45,122 62,122 C 83,122 100,105 100,86 C 100,67 83,50 62,50 Z"
              fill="url(#fullSilver)"
              fillRule="evenodd"
            />

            <path
              d="M 145,25 C 181,25 210,54 210,90 C 210,126 181,155 145,155 C 109,155 80,126 80,90 C 80,54 109,25 145,25 Z M 145,50 C 123,50 105,68 105,90 C 105,112 123,130 145,130 C 167,130 185,112 185,90 C 185,68 167,50 145,50 Z"
              fill="url(#fullLime)"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 font-mono text-center">
        <span className="font-black text-xl tracking-tighter text-white uppercase">UNRETAIL</span>
        <span className="text-xs text-neon-lime uppercase tracking-widest font-bold animate-pulse">
          {message}
        </span>
      </div>
    </div>
  );
}
