'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { ShieldCheck, MapPin, Tag, ShoppingBag, ArrowLeft, CheckCircle2, Store, Clock, Zap } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.itemId || 'item-101';

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/items/${itemId}`);
      if (res.data?.data) {
        setItem(res.data.data);
      }
    } catch (err) {
      console.warn('Item details fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!item) return;
    setPurchasing(true);
    setOrderSuccess(null);

    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('unretail_user') : null;
      const user = storedUser ? JSON.parse(storedUser) : null;

      const res = await apiClient.post('/payments/create-order', {
        itemId: item.id,
        shopId: item.shopId || item.shop?.id || 'shop-1',
        buyerId: user?.id || 'guest_collector',
      });

      if (res.data?.success) {
        setOrderSuccess({
          orderId: res.data.order?.id,
          razorpayOrderId: res.data.razorpayOrder?.id,
          amount: res.data.order?.amountPaid || item.price,
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Order creation failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 p-8 max-w-7xl mx-auto flex items-center justify-center font-mono text-sm">
        <div className="animate-pulse">Loading Grail Specs...</div>
      </div>
    );
  }

  const images =
    item?.images && item.images.length > 0
      ? item.images
      : [
          'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        ];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-neon-lime transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800 overflow-hidden relative shadow-2xl">
            <img
              src={images[selectedImage]}
              alt={item?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-neon-lime text-black font-mono font-bold text-xs px-3 py-1">
              STATUS: {item?.status || 'AVAILABLE'}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 shrink-0 bg-zinc-950 border overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-neon-lime ring-1 ring-neon-lime' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-neon-lime font-mono text-xs uppercase mb-3">
              <Zap className="w-3.5 h-3.5 fill-neon-lime" />
              <span>Authentic Physical Rack Item</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
              {item?.title}
            </h1>
            <div className="text-3xl font-black font-mono text-white mt-3">
              {formatCurrency(item?.price || 0)}
            </div>
          </div>

          {/* Attribute Specs Grid */}
          <div className="grid grid-cols-2 gap-3 bg-street-card border border-zinc-800 p-4 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block uppercase text-[10px]">Condition</span>
              <span className="font-bold text-emerald-400">{formatCondition(item?.condition)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase text-[10px]">Size Tag</span>
              <span className="font-bold text-white">{item?.size || 'OS'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase text-[10px]">Category</span>
              <span className="font-bold text-white">{item?.category || 'Apparel'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase text-[10px]">Era / Origin</span>
              <span className="font-bold text-amber-400">{item?.era || '90s'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">Curator Description</h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-950 p-4 border border-zinc-800">
              {item?.description}
            </p>
          </div>

          {/* Merchant Vendor Card */}
          <div className="bg-street-card border border-zinc-800 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase tracking-widest text-[10px]">VERIFIED STOREFRONT</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] uppercase font-bold">
                INSTORE SYNC ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-neon-lime">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  {item?.shop?.shopName || 'Relic Vintage Co.'}
                  <ShieldCheck className="w-4 h-4 text-neon-lime" />
                </h4>
                <div className="text-zinc-400 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{item?.shop?.address || '42 Bandra West, Hill Road'}, {item?.shop?.city || 'Mumbai'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Razorpay Purchase Trigger */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <button
              onClick={handleCheckout}
              disabled={purchasing || item?.status === 'SOLD'}
              className="w-full bg-neon-lime text-black font-black text-sm uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>
                {purchasing ? 'Initiating Razorpay Escrow...' : item?.status === 'SOLD' ? 'ITEM SOLD OUT' : 'BUY NOW WITH RAZORPAY'}
              </span>
            </button>
            <p className="text-[10px] font-mono text-zinc-500 text-center">
              100% Escrow Protection • 7-Day Returns & Dispute Resolution
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Success Dialog */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-street-card border border-neon-lime w-full max-w-md p-6 text-center space-y-4 font-mono shadow-2xl relative">
            <div className="w-12 h-12 bg-neon-lime text-black rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Order Placed Successfully!
            </h3>
            <p className="text-xs text-zinc-400">
              Your payment order has been created and verified on Razorpay escrow.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Order ID:</span>
                <span className="text-white font-bold">{orderSuccess.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Razorpay Order ID:</span>
                <span className="text-neon-lime font-bold">{orderSuccess.razorpayOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount Paid:</span>
                <span className="text-white font-bold">{formatCurrency(orderSuccess.amount)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/orders"
                className="flex-1 bg-neon-lime text-black font-extrabold text-xs uppercase py-3 hover:bg-white"
              >
                Track In My Orders
              </Link>
              <button
                onClick={() => setOrderSuccess(null)}
                className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase py-3 px-4 border border-zinc-800 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
