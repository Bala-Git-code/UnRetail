'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import apiClient from '@/lib/api-client';
import { ShieldCheck, ArrowRight, UserCheck, Store, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('CUSTOMER');

  const roleRef = useRef(role);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const handleGoogleAuth = async (email, fullName, userRole, idToken = 'mock_google_id_token_2026', avatarUrl = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/google', {
        id_token: idToken,
        email: email || 'collector@unretail.in',
        fullName: fullName || 'Thrift Collector',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: userRole || 'CUSTOMER',
      });

      if (response.data?.token) {
        localStorage.setItem('unretail_token', response.data.token);
        localStorage.setItem('unretail_user', JSON.stringify(response.data.user));

        if (response.data.user?.role === 'MERCHANT') {
          router.push('/dashboard');
        } else if (response.data.user?.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/feed');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode Google JWT payload:', e);
      return null;
    }
  };

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    const decoded = decodeJwtPayload(idToken);
    
    if (decoded) {
      await handleGoogleAuth(
        decoded.email,
        decoded.name,
        roleRef.current,
        idToken,
        decoded.picture
      );
    } else {
      setError('Invalid token payload received from Google.');
    }
  };

  const initializeGoogleAuth = () => {
    if (typeof window !== 'undefined' && window.google) {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
      
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '382',
        }
      );
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      initializeGoogleAuth();
    }
  }, []);

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-center items-center p-4 relative font-sans">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogleAuth}
      />

      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-lime/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Single Card Login Container */}
      <div className="w-full max-w-md bg-street-card border border-zinc-800 p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-neon-lime text-black font-black flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#ffffff]">
              UR
            </div>
            <span className="font-black text-2xl tracking-tighter text-white group-hover:text-neon-lime transition-colors">
              UNRETAIL<span className="text-neon-lime">.</span>
            </span>
          </Link>

          <span className="text-xs font-mono tracking-widest text-neon-lime uppercase bg-neon-lime/10 px-3 py-1 border border-neon-lime/20 mb-2">
            SINGLE-SIGN-ON PORTAL
          </span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Sign In To UnRetail
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Access curated feeds, manage vendor racks, or moderate disputes.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Select Your Role
          </label>
          <div className="flex gap-2 w-full font-mono text-xs">
            <button
              onClick={() => setRole('CUSTOMER')}
              type="button"
              className={`flex-1 py-2.5 text-center border transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-neon-lime text-black border-neon-lime font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              CUSTOMER
            </button>
            <button
              onClick={() => setRole('MERCHANT')}
              type="button"
              className={`flex-1 py-2.5 text-center border transition-all ${
                role === 'MERCHANT'
                  ? 'bg-neon-lime text-black border-neon-lime font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              MERCHANT
            </button>
          </div>
        </div>

        {/* Primary Google Auth Button */}
        <div className="w-full flex justify-center mb-6">
          <div id="google-signin-btn" className="w-full max-w-[382px] [&_iframe]:!mx-auto" style={{ minHeight: '44px' }}></div>
        </div>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-street-card px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            OR DEMO ONE-CLICK ENTRY
          </span>
        </div>

        {/* Demo Fast Login Cards */}
        <div className="space-y-3 font-mono text-xs">
          <button
            onClick={() => handleGoogleAuth('collector@unretail.in', 'Thrift Collector', 'CUSTOMER')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold uppercase text-white">Customer Demo</div>
                <div className="text-[10px] text-zinc-500">Browse feed, search & checkout</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleGoogleAuth('aarav@relicvintage.in', 'Aarav Patel', 'MERCHANT')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-neon-lime" />
              <div>
                <div className="font-bold uppercase text-white">Merchant Vendor Demo</div>
                <div className="text-[10px] text-zinc-500">List items, 1-tap in-store sold sync</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleGoogleAuth('admin@unretail.in', 'System Admin', 'ADMIN')}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-neon-lime p-3 text-left flex items-center justify-between text-zinc-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-bold uppercase text-white">Platform Admin Demo</div>
                <div className="text-[10px] text-zinc-500">GMV revenue cut, verify vendors & disputes</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-neon-lime group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] font-mono text-zinc-500">
          By signing in, you agree to UnRetail&apos;s Escrow Terms and Vendor Marketplace Policies.
        </div>
      </div>
    </div>
  );
}
