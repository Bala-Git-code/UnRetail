'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShoppingBag, Store, Check, ArrowRight } from 'lucide-react';

function SelectRoleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'merchant' ? 'merchant' : 'shopper';

  const [selectedRole, setSelectedRole] = useState<'shopper' | 'merchant'>(initialRole);
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Upsert profile
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          role: selectedRole,
          full_name: user.user_metadata?.full_name || 'Thrift Explorer',
          updated_at: new Date().toISOString(),
        });

        // If merchant, create initial shop if provided
        if (selectedRole === 'merchant' && shopName.trim()) {
          const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase.from('shops').upsert({
            owner_id: user.id,
            name: shopName,
            slug,
            description: 'Curated thrift & vintage items.',
          });
        }
      }

      if (selectedRole === 'merchant') {
        router.push('/dashboard');
      } else {
        router.push('/feed');
      }
    } catch (err) {
      console.error('Role setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shopper Card */}
        <div
          onClick={() => setSelectedRole('shopper')}
          className={`cursor-pointer p-6 rounded-2xl border transition-all space-y-3 relative ${
            selectedRole === 'shopper'
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          {selectedRole === 'shopper' && (
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Shopper</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Discover rare thrift apparel, follow local vendors, and place secure orders.
            </p>
          </div>
        </div>

        {/* Merchant Card */}
        <div
          onClick={() => setSelectedRole('merchant')}
          className={`cursor-pointer p-6 rounded-2xl border transition-all space-y-3 relative ${
            selectedRole === 'merchant'
              ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          {selectedRole === 'merchant' && (
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Merchant / Thrift Shop</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Sell vintage inventory, manage orders, track analytics, and build your brand.
            </p>
          </div>
        </div>
      </div>

      {selectedRole === 'merchant' && (
        <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Storefront Name (Optional)
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Relic Vintage & Co."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-slate-950 ${
          selectedRole === 'merchant'
            ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
            : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
        }`}
      >
        {loading ? 'Setting up Profile...' : 'Complete Registration'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}

export default function SelectRolePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-xl glass-card p-8 rounded-3xl border border-slate-800 space-y-8 relative z-10 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Onboarding</span>
          <h2 className="text-3xl font-extrabold text-slate-100">Choose Your Account Type</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            How do you plan to use Unretail? You can change this or add a storefront later.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading role selector...</div>}>
          <SelectRoleForm />
        </Suspense>
      </div>
    </div>
  );
}
