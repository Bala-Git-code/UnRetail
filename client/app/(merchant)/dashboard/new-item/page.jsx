'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Camera, Upload, CheckCircle2, AlertCircle, ArrowLeft, Tag, Layers, Sparkles, X, Info } from 'lucide-react';

export default function NewItemListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [size, setSize] = useState('L');
  const [era, setEra] = useState('90s');
  const [condition, setCondition] = useState('GENTLY_USED');
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasShop, setHasShop] = useState(true);
  const [checkingShop, setCheckingShop] = useState(true);

  const eras = ['70s', '80s', '90s', 'Y2K', 'Archival'];
  const categories = ['Apparel', 'Outerwear', 'Denim', 'Footwear', 'Accessories'];
  const sizes = ['S', 'M', 'L', 'XL', 'W32 L30', 'OS'];
  const conditions = [
    { value: 'LIKE_NEW', label: 'Pristine / Like New' },
    { value: 'GENTLY_USED', label: 'Gently Loved' },
    { value: 'FLAWED', label: 'Vintage Character' },
  ];

  useEffect(() => {
    checkShopStatus();
  }, []);

  const checkShopStatus = async () => {
    try {
      const res = await apiClient.get('/merchant/my-shop');
      if (res.data?.success && res.data?.data) {
        setHasShop(true);
      } else {
        setHasShop(false);
      }
    } catch (err) {
      console.warn('Failed to verify shop status:', err);
      setHasShop(false);
    } finally {
      setCheckingShop(false);
    }
  };

  // Mobile camera / image upload handler
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setErrorMsg(null);

    try {
      const sigRes = await apiClient.get('/cloudinary/signature');
      const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data.data;

      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        setImages((prev) => [...prev, uploadData.secure_url]);
      } else {
        const fakeUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, fakeUrl]);
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback:', err);
      const localUrl = URL.createObjectURL(files[0]);
      setImages((prev) => [...prev, localUrl]);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSampleImage = (url) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      setErrorMsg('Please enter item title and price');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        category,
        subcategory: subcategory || undefined,
        brand: brand || undefined,
        serialNumber: serialNumber || undefined,
        size,
        era,
        condition,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'],
      };

      const res = await apiClient.post('/items', payload);
      if (res.data?.success) {
        setSuccessMsg('Item successfully listed on live feed and search index!');
        setTimeout(() => {
          router.push('/dashboard/listings');
        }, 1200);
      }
    } catch (err) {
      console.error('Create item error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to list item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mobile Camera 60-Sec Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            New Rack Item Listing
          </h1>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-neon-lime" /> Cancel
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-neon-lime/10 border border-neon-lime/30 text-neon-lime p-4 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Photo Upload Box (Camera / File) */}
        <div className="space-y-3 bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
            1. Rack Photos (Mobile Camera / Upload)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Active Photos */}
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative aspect-square bg-zinc-950 border border-zinc-700/80 rounded-xl overflow-hidden group shadow-md">
                <img src={imgUrl} alt="Listing" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/80 text-rose-400 p-1.5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Camera Input Button */}
            <label className="aspect-square bg-zinc-900/60 border-2 border-dashed border-zinc-700 hover:border-neon-lime rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-all">
              <Camera className="w-6 h-6 text-zinc-400 group-hover:text-neon-lime mb-2 transition-colors" />
              <span className="text-[11px] text-zinc-300 font-medium group-hover:text-white">
                {uploadingImage ? 'Uploading...' : 'Snap Camera Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Sample Presets:</span>
            <button
              type="button"
              onClick={() => handleAddSampleImage('/images/denim_vintage.png')}
              className="text-zinc-400 hover:text-neon-lime underline font-medium"
            >
              + 90s Levi Denim
            </button>
            <button
              type="button"
              onClick={() => handleAddSampleImage('/images/leather_jacket.png')}
              className="text-zinc-400 hover:text-neon-lime underline font-medium"
            >
              + Leather Bomber
            </button>
            <button
              type="button"
              onClick={() => handleAddSampleImage('/images/graphic_tee.png')}
              className="text-zinc-400 hover:text-neon-lime underline font-medium"
            >
              + Vintage Graphic Tee
            </button>
          </div>
        </div>

        {/* Item Title & Price */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">2. Item Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1990s Vintage Levi 501 Heavyweight Denim"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">3. Price (INR) *</label>
              <input
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 5499"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm tabular-nums focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>
          </div>

          {/* Brand, Subcategory, Serial Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Brand (Optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Levi's, Harley"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Subcategory (Optional)</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. 501, Leather Bomber"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Serial Number / Verification ID</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-99824"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">4. Item Details & Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe wash patina, distressing details, or fit specifications..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
            />
          </div>
        </div>

        {/* Pill Selectors */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          {/* Era */}
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">5. Vintage Era</label>
            <div className="flex flex-wrap gap-2">
              {eras.map((itemEra) => (
                <button
                  type="button"
                  key={itemEra}
                  onClick={() => setEra(itemEra)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    era === itemEra
                      ? 'bg-neon-lime text-black shadow-sm font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {itemEra}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">6. Condition Tag</label>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    condition === c.value
                      ? 'bg-neon-lime text-black shadow-sm font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">7. Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      category === cat
                        ? 'bg-neon-lime text-black shadow-sm font-bold'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">8. Size Tag</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      size === s
                        ? 'bg-neon-lime text-black shadow-sm font-bold'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instant Publish Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neon-lime hover:bg-white text-black font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_24px_rgba(204,255,0,0.3)] active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            <span>{submitting ? 'Publishing To Live Feed...' : 'Publish Item to Live Rack Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
