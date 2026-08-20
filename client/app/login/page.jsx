'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import apiClient from '@/lib/api-client';
import { 
  Store, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Lock
} from 'lucide-react';
import { LogoSymbol } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'MERCHANT'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const googleBtnRef = useRef(null);
  const roleRef = useRef(role);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const getRedirectTarget = (userRole) => {
    if (userRole === 'MERCHANT') return '/dashboard';
    if (userRole === 'ADMIN') return '/admin/dashboard';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect && redirect.startsWith('/')) return redirect;
    }
    return '/feed';
  };

  // Check if active user is present for display
  useEffect(() => {
    const storedUser = localStorage.getItem('unretail_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.fullName) {
          // Keep state ready but don't forcibly trap in redirect loop
        }
      } catch (e) {}
    }
  }, [router]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setError('Google Sign-In failed. Please try again.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const activeRole = roleRef.current || role;
      const res = await apiClient.post('/auth/google', {
        id_token: response.credential,
        role: activeRole,
      });

      if (res.data?.token && res.data?.user) {
        localStorage.setItem('unretail_token', res.data.token);
        localStorage.setItem('unretail_user', JSON.stringify(res.data.user));
        setSuccessMsg(`Welcome, ${res.data.user.fullName || res.data.user.email || 'Shopper'}! Redirecting...`);

        setTimeout(() => {
          router.push(getRedirectTarget(res.data.user.role));
        }, 700);
      } else {
        throw new Error(res.data?.error || 'Sign in response was invalid');
      }
    } catch (err) {
      console.error('Google Auth error:', err);
      setError(err.response?.data?.error || err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoUser = {
        id: role === 'MERCHANT' ? 'demo_merchant_1' : 'demo_customer_1',
        fullName: role === 'MERCHANT' ? 'Aarav Patel' : 'Rahul Sharma',
        email: role === 'MERCHANT' ? 'aarav@relicvintage.in' : 'rahul.sharma@unretail.in',
        role: role,
        phoneNumber: '9876543210',
        address: '42 Bandra West, Hill Road',
        city: 'Mumbai',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      };

      try {
        const res = await apiClient.post('/auth/google', {
          email: demoUser.email,
          fullName: demoUser.fullName,
          role: demoUser.role,
          avatarUrl: demoUser.avatarUrl,
        });
        if (res.data?.token && res.data?.user) {
          localStorage.setItem('unretail_token', res.data.token);
          localStorage.setItem('unretail_user', JSON.stringify(res.data.user));
          setSuccessMsg(`Welcome, ${res.data.user.fullName}! Redirecting...`);
          setTimeout(() => {
            router.push(getRedirectTarget(res.data.user.role));
          }, 500);
          return;
        }
      } catch (postErr) {
        // Fallback to local storage
      }

      localStorage.setItem('unretail_token', 'demo_jwt_token_' + Date.now());
      localStorage.setItem('unretail_user', JSON.stringify(demoUser));
      setSuccessMsg(`Signed in as ${demoUser.fullName}! Redirecting...`);
      setTimeout(() => {
        router.push(getRedirectTarget(demoUser.role));
      }, 500);
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const initGoogleGsi = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '469391995611-l5jv5h8ialovojpnh9aflv8r9cei7a7v.apps.googleusercontent.com';
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 340,
          });
        }
      } catch (err) {
        console.error('Google GSI initialization error:', err);
      }
    }
  };

  useEffect(() => {
    initGoogleGsi();
  }, [role]);

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-10 relative font-sans overflow-x-hidden selection:bg-neon-lime selection:text-black">
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive" 
        onLoad={initGoogleGsi} 
      />

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-neon-lime/10 blur-[180px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-400/8 blur-[170px] rounded-full pointer-events-none" />

      {/* Minimal Background Mesh */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-6xl flex items-center justify-between py-2 mb-4">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <LogoSymbol size="sm" animated />
          <span className="font-black text-xl tracking-tighter text-white group-hover:text-neon-lime transition-colors">
            UNRETAIL<span className="text-neon-lime">.</span>
          </span>
        </Link>

        <Link
          href="/feed"
          className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-2 transition-all px-3.5 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4 text-neon-lime" />
          <span>Back To Shop</span>
        </Link>
      </header>

      {/* Unique Dual-Column Luxury Frame */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 luxury-glass rounded-[2.5rem] overflow-hidden border border-zinc-800/90 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] relative z-10 my-auto">
        
        {/* Left Column: High-Fashion Single Editorial Visual */}
        <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[640px] overflow-hidden bg-zinc-950 flex flex-col justify-between p-6 sm:p-8">
          
          {/* Editorial Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/thrift_store_sign.jpg"
              alt="UnRetail Thrift Store & Archival Exchange"
              fill
              priority
              className="object-cover object-center filter brightness-[0.92] contrast-105 hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-street-black via-street-black/30 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-street-black/60 hidden lg:block" />
          </div>

          {/* Floating Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-street-black/75 backdrop-blur-md border border-neon-lime/30 rounded-full text-xs font-mono text-neon-lime shadow-xl">
              <span className="w-2 h-2 rounded-full bg-neon-lime animate-ping" />
              <span>LIVE ARCHIVE</span>
            </div>
          </div>

          {/* Floating Bottom Editorial Branding */}
          <div className="relative z-10 space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-neon-lime uppercase font-semibold">
              Curated Thrift & Streetwear
            </div>
            <div className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-none drop-shadow-lg">
              The Physical Archive Exchange<span className="text-neon-lime">.</span>
            </div>
          </div>

        </div>

        {/* Right Column: Sleek High-Contrast Authentication Panel */}
        <div className="lg:col-span-6 flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14 bg-street-black/90 relative z-10 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/25 rounded-full text-xs font-medium text-neon-lime shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick & Secure Sign In</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Welcome to UnRetail
            </h1>

            <p className="text-xs text-zinc-400 font-sans">
              Choose your account type to continue with Google.
            </p>
          </div>

          {/* Dynamic Segmented Role Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              I AM A:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/90 shadow-inner">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-3 px-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold ${
                  role === 'CUSTOMER'
                    ? 'bg-neon-lime text-black shadow-[0_0_20px_rgba(204,255,0,0.35)] scale-[1.02]'
                    : 'text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900/50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Shopper / Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('MERCHANT')}
                className={`py-3 px-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold ${
                  role === 'MERCHANT'
                    ? 'bg-neon-lime text-black shadow-[0_0_20px_rgba(204,255,0,0.35)] scale-[1.02]'
                    : 'text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900/50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Thrift Store / Seller</span>
              </button>
            </div>
          </div>

          {/* Feedback Notifications */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-3 animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs flex items-center gap-3 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 animate-pulse" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Google Action Container */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 space-y-5 shadow-inner relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/5 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-1">
              <div className="text-xs font-semibold text-zinc-300">
                Signing in as: <span className="text-neon-lime font-bold">{role === 'MERCHANT' ? 'Thrift Store Seller' : 'Shopper'}</span>
              </div>
              <p className="text-xs text-zinc-400">
                {role === 'MERCHANT'
                  ? 'Manage your store items, physical racks & customer orders'
                  : 'Discover rare thrift finds, track orders & shop with buyer protection'}
              </p>
            </div>

            {/* Official Google Identity Services SDK Button */}
            <div className="flex justify-center w-full min-h-[44px] overflow-hidden rounded-xl">
              <div ref={googleBtnRef} className="flex justify-center w-full" />
            </div>

            {/* Fast Demo Autofill / Quick Sign In Button */}
            <div className="pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-neon-lime hover:text-black text-zinc-300 border border-zinc-750 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Signing In...' : `Instant ${role === 'MERCHANT' ? 'Merchant' : 'Customer'} Demo Sign In`}</span>
              </button>
            </div>
          </div>

          {/* Minimal Trust Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2.5 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800/80">
              <ShieldCheck className="w-4 h-4 text-neon-lime shrink-0" />
              <span>Secure Google Sign-In</span>
            </div>
            <div className="flex items-center gap-2.5 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800/80">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>No Password Needed</span>
            </div>
          </div>

          {/* Store Administrator Link */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Store administrator?</span>
            <Link 
              href="/admin/login" 
              className="text-zinc-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 font-semibold group"
            >
              <span>Admin Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full py-3 text-center text-xs font-mono text-zinc-600">
        UNRETAIL THRIFT & VINTAGE MARKETPLACE
      </footer>
    </div>
  );
}
