'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Store, ShieldCheck, MapPin, Tag, CheckCircle2, CreditCard, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [purchasing, setPurchasing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await apiClient.get(`/items/${itemId}`);
      if (response.data.success) {
        setItem(response.data.data);
        if (response.data.data.images?.length > 0) {
          setSelectedImage(response.data.data.images[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load item details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setPurchasing(true);
    setOrderSuccess(null);

    try {
      const response = await apiClient.post('/payments/create-order', {
        itemId: item?.id || itemId,
        shopId: item?.shop?.id || 'shop-1',
      });

      if (response.data.success) {
        const { razorpayOrder, order } = response.data;
        setOrderSuccess(`Razorpay Order Created (${razorpayOrder.id}). Redirecting to order confirmation...`);

        // Simulate Razorpay SDK Payment Modal & success redirect
        setTimeout(() => {
          router.push('/orders');
        }, 1800);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout error: ' + (err.response?.data?.error || err.message));
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
        <p className="text-sm">Loading 1-of-1 thrift piece...</p>
      </div>
    );
  }

  const currentItem = item || {
    id: itemId,
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    description:
      'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA with heavyweight 14oz rigid denim, classic button fly, and straight leg fit. Zero tears or fraying.',
    price: 68.0,
    category: 'Apparel',
    size: 'W32 L30',
    era: '90s',
    condition: 'LIKE_NEW',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'AVAILABLE',
    shop: {
      id: 'shop-1',
      shopName: 'Relic Vintage Co.',
      city: 'Mumbai',
      address: '42 Bandra West, Hill Road',
      isVerified: true,
      owner: { fullName: 'Aarav Patel' },
    },
  };

  const displayImage = selectedImage || currentItem.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to discovery
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Photo Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow-xl">
            <img src={displayImage} alt={currentItem.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {currentItem.era || 'Vintage'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-medium text-slate-200 border border-slate-800">
                {currentItem.condition?.replace('_', ' ') || 'LIKE NEW'}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {currentItem.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {currentItem.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    displayImage === img ? 'border-emerald-500 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Checkout Column */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Shop Header Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {currentItem.shop?.shopName || 'Relic Vintage Co.'}
                    {currentItem.shop?.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {currentItem.shop?.address}, {currentItem.shop?.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{currentItem.title}</h1>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-emerald-400">₹{currentItem.price}</span>
              <span className="text-xs text-slate-400">Fixed Thrift Price • 1-of-1 Piece</span>
            </div>

            {/* Attribute Badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Size</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{currentItem.size || 'OS'}</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Era</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{currentItem.era || '90s'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Condition</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block">
                  {currentItem.condition?.replace('_', ' ') || 'LIKE NEW'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Item Story & Details</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                {currentItem.description}
              </p>
            </div>
          </div>

          {/* Checkout Banner & Action */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            {orderSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{orderSuccess}</span>
              </div>
            )}

            <button
              onClick={handleBuyNow}
              disabled={purchasing || currentItem.status === 'SOLD'}
              className="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:opacity-95 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {purchasing
                ? 'Creating Razorpay Order...'
                : currentItem.status === 'SOLD'
                ? 'Piece Sold Out'
                : `Buy 1-of-1 Piece • ₹${currentItem.price} (Razorpay)`}
            </button>
            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secured by Razorpay • Direct payout to verified shop owner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
