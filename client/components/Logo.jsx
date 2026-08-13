'use client';

import React from 'react';

/**
 * Reusable Interlocking Logo Symbol Component (Silver Teardrop + Neon Lime Ring)
 */
export function LogoSymbol({ size = 'md', className = '', glow = true, animated = false }) {
  const sizeMap = {
    xs: 'w-6 h-4.5',
    sm: 'w-8 h-6',
    md: 'w-10 h-7.5',
    lg: 'w-14 h-10.5',
    xl: 'w-20 h-15',
    '2xl': 'w-28 h-21',
  };

  const dimensionClass = typeof size === 'string' && sizeMap[size] ? sizeMap[size] : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dimensionClass} ${className} ${
        animated ? 'hover:scale-105 transition-transform duration-300' : ''
      }`}
    >
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Silver Gradient */}
          <linearGradient id="symSilver" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#F3F4F6" />
            <stop offset="50%" stopColor="#9CA3AF" />
            <stop offset="75%" stopColor="#4B5563" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          {/* Specular Metallic Gloss */}
          <linearGradient id="symGloss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E5E7EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#374151" stopOpacity="0.8" />
          </linearGradient>

          {/* Neon Lime Gradient */}
          <linearGradient id="symLime" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="35%" stopColor="#CCFF00" />
            <stop offset="70%" stopColor="#A3E635" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>

          {/* Glow Filter */}
          {glow && (
            <filter id="symGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        <g>
          {/* Silver Teardrop Loop (Left Ring) */}
          <path
            d="M 62,25 
               C 98,25 125,50 125,86 
               C 125,122 98,147 62,147 
               C 32,147 25,125 25,86 
               C 25,47 32,25 62,25 Z
               M 62,50
               C 45,50 43,65 43,86
               C 43,107 45,122 62,122
               C 83,122 100,105 100,86
               C 100,67 83,50 62,50 Z"
            fill="url(#symSilver)"
            fillRule="evenodd"
          />

          {/* Specular Highlight Layer */}
          <path
            d="M 62,25 C 98,25 125,50 125,86 C 125,122 98,147 62,147 C 32,147 25,125 25,86 C 25,47 32,25 62,25 Z M 62,50 C 45,50 43,65 43,86 C 43,107 45,122 62,122 C 83,122 100,105 100,86 C 100,67 83,50 62,50 Z"
            fill="url(#symGloss)"
            fillRule="evenodd"
            opacity="0.6"
          />

          {/* Neon Lime Circular Ring (Right Ring) */}
          <path
            d="M 145,25 
               C 181,25 210,54 210,90 
               C 210,126 181,155 145,155 
               C 109,155 80,126 80,90 
               C 80,54 109,25 145,25 Z
               M 145,50
               C 123,50 105,68 105,90
               C 105,112 123,130 145,130
               C 167,130 185,112 185,90
               C 185,68 167,50 145,50 Z"
            fill="url(#symLime)"
            fillRule="evenodd"
            filter={glow ? 'url(#symGlow)' : undefined}
          />

          {/* Interlocking Top Overlap for 3D Chain Effect */}
          <path
            d="M 85,38 
               C 98,44 108,55 114,68 
               C 105,62 95,58 84,56
               C 77,55 70,55 62,55
               C 62,50 73,39 85,38 Z"
            fill="url(#symSilver)"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Full UNRETAIL Logo (Interlocking Symbol + Metallic Text + Neon Tagline)
 */
export default function Logo({
  size = 'md',
  showSubtitle = false,
  className = '',
  symbolOnly = false,
  taglineText = 'CONNECTING INDEPENDENT THRIFT STORES WITH CUSTOMERS',
}) {
  if (symbolOnly) {
    return <LogoSymbol size={size} className={className} />;
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const textSize = textSizes[size] || 'text-xl';

  return (
    <div className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      <LogoSymbol size={size} animated />

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tighter uppercase font-sans text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-400 group-hover:from-white group-hover:to-neon-lime transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${textSize}`}
        >
          UNRETAIL<span className="text-neon-lime animate-pulse">.</span>
        </span>

        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-widest text-neon-lime uppercase drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]">
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
}
