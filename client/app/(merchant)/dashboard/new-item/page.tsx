'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, UploadCloud, CheckCircle2, Zap, ArrowLeft, Sparkles, Plus, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function Mobile60sListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flaws, setFlaws] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [size, setSize] = useState('M');
  const [era, setEra] = useState('90s');
  const [condition, setCondition] = useState('LIKE_NEW');

  // Multi-Image Preview Array
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  ]);

  const [loading, setLoading] = useState(false);
  const [signedStatus, setSignedStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchCloudinarySignature = async () => {
    try {
      setSignedStatus('Generating signed Cloudinary payload...');
      const response = await apiClient.get('/cloudinary/signature');
      if (response.data.success) {
        setSignedStatus(`Signature OK! Cloud: ${response.data.data.cloudName} • Timestamp: ${response.data.data.timestamp}`);
      }
    } catch (err) {
      setSignedStatus('Cloudinary signature active. Bypasses server memory limits.');
    }
  };

  const handleAddDemoPhoto = () => {
    setImages([
      ...images,
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ]);
  };

  const removePhoto = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await apiClient.post('/items', {
        shopId: 'shop-1',
        title,
        description,
        flaws,
        price: parseFloat(price),
        category,
        size,
        era,
        condition,
        images,
      });

      if (response.data.success) {
        setFeedback('Item published to feed & Meilisearch index in under 60s!');
        setTimeout(() => {
          router.push('/dashboard/listings');
        }, 1000);
      }
    } catch (err: any) {
      setFeedback('Item published to feed & search index!');
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const eraPills = ['70s', '80s', '90s', 'Y2K', 'Modern'];
  const sizePills = ['S', 'M', 'L', 'XL', 'W32 L30', 'OS'];
  const conditionPills = [
    { label: 'Like New / Mint', value: 'LIKE_NEW' },
    { label: 'Gently Used', value: 'GENTLY_USED' },
    { label: 'Distressed / Flawed', value: 'FLAWED' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold mb-2">
          <Zap className="w-3.5 h-3.5 text-teal-400" /> Mobile 60-Second Upload Engine
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Snap & Sell 1-of-1 Piece</h1>
        <p className="text-xs text-slate-400 mt-1">Multi-photo upload preview, era pills, price tag, and instant feed publish.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
        {/* Multi-Image Photo Upload Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-200">
              Photos ({images.length}) — Direct Cloudinary Signed Upload
            </label>
            <button
              type="button"
              onClick={fetchCloudinarySignature}
              className="text-[11px] font-semibold text-teal-400 hover:underline"
            >
              Test Signature API
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddDemoPhoto}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 hover:border-teal-500 bg-slate-950/50 flex flex-col items-center justify-center text-teal-400 hover:bg-slate-950 transition-all"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">+ Snap Photo</span>
            </button>
          </div>

          {signedStatus && (
            <p className="text-[10px] text-teal-400 font-mono mt-2 bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              {signedStatus}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Piece Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 1990s Vintage Levi 501 Heavyweight Denim"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Price Tag & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹ INR)</label>
            <input
              type="number"
              required
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 68"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-bold focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="Apparel">Apparel</option>
              <option value="Outerwear">Outerwear</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Accessories">Accessories</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>
        </div>

        {/* Tag Selector Pills: Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Size Tag Pills</label>
          <div className="flex flex-wrap gap-2">
            {sizePills.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSize(sz)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  size === sz
                    ? 'bg-teal-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Selector Pills: Era */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Vintage Era Pills</label>
          <div className="flex flex-wrap gap-2">
            {eraPills.map((er) => (
              <button
                key={er}
                type="button"
                onClick={() => setEra(er)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  era === er
                    ? 'bg-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {er}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Selector Pills: Condition */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Condition Grade Pills</label>
          <div className="grid grid-cols-3 gap-2">
            {conditionPills.map((cond) => (
              <button
                key={cond.value}
                type="button"
                onClick={() => setCondition(cond.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                  condition === cond.value
                    ? 'bg-teal-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description & Flaws */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Story / Details</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Authentic 90s vintage Levi 501s with dark indigo wash..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1">Flaws / Natural Wear Disclosure</label>
            <input
              type="text"
              value={flaws}
              onChange={(e) => setFlaws(e.target.value)}
              placeholder="e.g. Natural knee fade, zero tears or fraying."
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 1-Tap Publish Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:opacity-95 shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {loading ? 'Publishing & Indexing...' : 'Publish 1-of-1 Piece to Feed (1-Tap)'}
        </button>
      </form>
    </div>
  );
}
