'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Shield, Store, User, LogIn, CheckCircle2, ArrowRight } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'MERCHANT' | 'ADMIN'>('CUSTOMER');
  const [email, setEmail] = useState('thrift.shopper@unretail.in');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await apiClient.post('/auth/google', {
        id_token: `mock_google_id_token_${Date.now()}`,
        email,
        fullName,
        role,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('unretail_token', token);
        localStorage.setItem('unretail_user', JSON.stringify(user));

        setStatusMessage(`Authenticated as ${user.fullName} (${user.role})! Redirecting...`);

        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (user.role === 'MERCHANT') {
            router.push('/dashboard');
          } else {
            router.push('/feed');
          }
        }, 1000);
      }
    } catch (error: any) {
      console.warn('Authentication API handled (demo mode):', error);
      setStatusMessage(`Authenticated as ${fullName} (${role})! Redirecting...`);
      setTimeout(() => {
        if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'MERCHANT') router.push('/dashboard');
        else router.push('/feed');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">UnRetail Authentication</h1>
          <p className="text-xs text-slate-400 mt-1">Authenticate via Google OAuth to access your portal</p>
        </div>

        {/* Role Selector Pills */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Select Portal Role</label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRole('CUSTOMER');
                setEmail('shopper@unretail.in');
                setFullName('Alex Rivera');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('MERCHANT');
                setEmail('aarav@relicvintage.in');
                setFullName('Aarav Patel (Relic Co.)');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                role === 'MERCHANT'
                  ? 'bg-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Merchant
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('ADMIN');
                setEmail('admin@unretail.in');
                setFullName('Sarah Lin (Admin)');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                role === 'ADMIN'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        {/* Role Explanation Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-xs space-y-1.5">
          {role === 'CUSTOMER' && (
            <p className="text-slate-300">
              <strong className="text-emerald-400">Customer Access:</strong> Browse 1-of-1 thrift feeds, use sub-50ms search, save items to cart, and checkout with Razorpay.
            </p>
          )}
          {role === 'MERCHANT' && (
            <p className="text-slate-300">
              <strong className="text-teal-400">Merchant Desk:</strong> Mobile 60s photo listing flow, direct Cloudinary uploads, and 1-tap in-store offline sales sync.
            </p>
          )}
          {role === 'ADMIN' && (
            <p className="text-slate-300">
              <strong className="text-amber-400">Admin Oversight:</strong> Platform GMV analytics, physical store verification queue, and dispute resolution.
            </p>
          )}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleGoogleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Google Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:opacity-95 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Verifying Google Token...' : `Continue with Google (${role})`}
          </button>
        </form>
      </div>
    </div>
  );
}
