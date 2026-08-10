'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackagePlus, UploadCloud, Tag, DollarSign, Sparkles, Check, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NewItemUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [condition, setCondition] = useState('Excellent');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch merchant shop
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (shop) {
          await supabase.from('items').insert({
            shop_id: shop.id,
            title,
            category,
            condition,
            price: parseFloat(price),
            description,
            images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'],
            status: 'active',
          });
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 1500);
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Fast Listing Workflow
        </div>
        <h1 className="text-3xl font-black text-slate-100">60-Second Thrift Upload Form</h1>
        <p className="text-xs text-slate-400">
          List pre-loved & vintage items rapidly. Auto-indexed into Meilisearch for buyer discovery.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5" /> Item listed successfully! Redirecting to inventory...
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Photo Upload Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Product Image URL
          </label>
          <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center space-y-3 transition-colors bg-slate-900/40">
            <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-200">Enter image URL or drop asset link</p>
              <p className="text-[10px] text-slate-500">Supports JPG, PNG, WebP up to 10MB</p>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1542272604..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Item Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 1990s Vintage Levi 501 Heavyweight Denim"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category & Condition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Apparel">Apparel</option>
              <option value="Outerwear">Outerwear</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Condition Rating
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Mint">Mint Vintage</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair / Distressed</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Price (USD) *
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="68.00"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Item Story & Details
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention sizing, wash details, era, flaw notes, or origin..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? 'Publishing Item...' : 'Publish Item to Marketplace'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
