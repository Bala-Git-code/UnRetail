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
  Lock,
  ShoppingBag,
  Tag
} from 'lucide-react';
import Logo, { LogoSymbol } from '@/components/Logo';

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

  useEffect(() => {
    // Redirect if user is already logged in
    const storedUser = localStorage.getItem('unretail_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (parsed.role === 'MERCHANT') {
          router.push('/dashboard');
        } else {
          router.push('/feed');
        }
      } catch (e) {
        // ignore JSON parse error
      }
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
        setSuccessMsg(`Signed in successfully! Welcome, ${res.data.user.fullName || res.data.user.email || 'Shopper'}. Redirecting...`);

        setTimeout(() => {
          if (res.data.user.role === 'MERCHANT') {
            router.push('/dashboard');
          } else if (res.data.user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/feed');
          }
        }, 800);
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
            width: 360,
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
    <div className="min-h-screen bg-street-black text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive" 
        onLoad={initGoogleGsi} 
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-lime/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-400/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2315_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2315_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      {/* Header */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between border-b border-zinc-800/60 bg-street-black/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <LogoSymbol size="md" />
          <span className="font-black text-xl tracking-tighter text-white group-hover:text-neon-lime transition-colors">
            UNRETAIL<span className="text-neon-lime">.</span>
          </span>
        </Link>

        <Link
          href="/feed"
          className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-2 transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 text-neon-lime" /> Back To Shop
        </Link>
      </header>

      {/* Main Split Layout */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto">
        
        {/* Left Column: Visual Showcase & Boutique Hero */}
        <div className="lg:col-span-7 relative flex flex-col justify-between p-8 lg:p-12 min-h-[420px] lg:min-h-[calc(100vh-81px)] border-b lg:border-b-0 lg:border-r border-zinc-800/80 overflow-hidden group">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/login_hero.jpg"
              alt="Curated Vintage Thrift Store"
              fill
              priority
              className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
            />
            {/* Dark & Vibrant Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-street-black via-street-black/75 to-street-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-street-black/85 via-transparent to-street-black/90" />
          </div>

          {/* Top Floating Glass Badges */}
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <div className="bg-street-black/80 backdrop-blur-md border border-neon-lime/30 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-neon-lime shadow-lg">
              <span className="w-2 h-2 rounded-full bg-neon-lime animate-ping" />
              <span>LIVE STORE INVENTORY</span>
            </div>

            <div className="bg-street-black/80 backdrop-blur-md border border-zinc-700/60 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-zinc-300 shadow-lg">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>CURATED VINTAGE FINDS</span>
            </div>
          </div>

          {/* Middle Dynamic Hero Content */}
          <div className="relative z-10 my-auto py-12 space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 px-3 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5 text-neon-lime" />
              Curated Thrift & Vintage Marketplace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[1.05]">
              Discover Unique <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-white to-amber-400">Thrift & Vintage</span> Fashion
            </h1>

            <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed">
              Find one-of-a-kind vintage pieces, explore local thrift boutique collections, and shop safely with easy, secure Google checkout.
            </p>

            {/* Floating Live Stats Card */}
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl text-center">
                <div className="text-xl lg:text-2xl font-black text-white">1,420+</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Unique Items</div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl text-center">
                <div className="text-xl lg:text-2xl font-black text-neon-lime">100%</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Verified Shops</div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl text-center">
                <div className="text-xl lg:text-2xl font-black text-amber-400">0</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Passwords Needed</div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Slogan */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-4">
            <span>UNRETAIL THRIFT MARKETPLACE</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShoppingBag className="w-3.5 h-3.5 text-neon-lime" /> TRUSTED LOCAL BOUTIQUES
            </span>
          </div>
        </div>

        {/* Right Column: Google Authentication Portal */}
        <div className="lg:col-span-5 flex flex-col justify-center p-6 md:p-10 lg:p-14 bg-street-black relative z-10">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header & Persona Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick & Secure Sign In</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome to UnRetail
              </h2>
              <p className="text-xs text-zinc-400">
                Choose your account type to continue with Google.
              </p>
            </div>

            {/* Role Toggle Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    role === 'CUSTOMER'
                      ? 'bg-neon-lime text-black shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white bg-zinc-900/40'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Shopper / Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('MERCHANT')}
                  className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    role === 'MERCHANT'
                      ? 'bg-neon-lime text-black shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white bg-zinc-900/40'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Thrift Store / Seller</span>
                </button>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 animate-bounce" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Primary Action Card: Authentic Google Sign-In */}
            <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/5 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-1">
                <div className="text-xs font-semibold text-zinc-300">
                  Signing in as: <span className="text-neon-lime">{role === 'MERCHANT' ? 'Thrift Store Seller' : 'Shopper'}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  {role === 'MERCHANT'
                    ? 'Manage your store items, physical racks & customer orders'
                    : 'Discover rare thrift finds, track orders & shop with buyer protection'}
                </p>
              </div>

              {/* Official Google Sign-In Container */}
              <div className="space-y-3">
                <div 
                  ref={googleBtnRef} 
                  className="w-full flex justify-center min-h-[44px] bg-zinc-950/80 border border-zinc-800 rounded-xl p-1" 
                />
              </div>
            </div>

            {/* Trust & Guarantee Badges (User-Friendly Terms) */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-zinc-400">
              <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <ShieldCheck className="w-4 h-4 text-neon-lime shrink-0" />
                <span>Secure Google Sign-In</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>No Password Needed</span>
              </div>
            </div>

            {/* Admin Desk Link */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Store administrator?</span>
              <Link 
                href="/admin/login" 
                className="text-zinc-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-medium"
              >
                Admin Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 border-t border-zinc-800/60 bg-street-black text-center text-xs font-mono text-zinc-500">
        UNRETAIL THRIFT & VINTAGE MARKETPLACE • SECURE GOOGLE LOGIN & BUYER PROTECTION
      </footer>
    </div>
  );
}

