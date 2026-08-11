'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Shield, Store, User, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
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
      // Simulate Google OAuth Token response & call Express Backend /api/v1/auth/google
      const response = await apiClient.post('/auth/google', {
        id_token: `mock_google_id_token_${Date.now()}`,
        email,
        fullName,
        role,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        // Store JWT token and user info in localStorage
        localStorage.setItem('unretail_token', token);
        localStorage.setItem('unretail_user', JSON.stringify(user));

        setStatusMessage(`Successfully signed in as ${user.fullName} (${user.role})! Redirecting...`);

        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (user.role === 'MERCHANT') {
            router.push('/dashboard');
          } else {
            router.push('/feed');
          }
        }, 1200);
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setStatusMessage(`Sign-in error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In to UnRetail</h1>
          <p className="text-xs text-slate-400 mt-1">Select your role and authenticate via Google OAuth</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Choose Portal Role</label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRole('CUSTOMER');
                setEmail('shopper@unretail.in');
                setFullName('Alex Rivera');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'ADMIN'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleGoogleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Google Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.startsWith('Sign-in error')
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {statusMessage.startsWith('Sign-in error') ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Google OAuth Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Verifying Google Token...' : `Continue with Google (${role})`}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          By signing in, you agree to UnRetail terms & verification standards.
        </p>
      </div>
    </div>
  );
}
