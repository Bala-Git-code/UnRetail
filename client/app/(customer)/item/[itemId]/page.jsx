'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition, maskSerialNumber } from '@/lib/utils';
import { isTechCategory } from '@/lib/taxonomy';
import {
  ShieldCheck,
  MapPin,
  Tag,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Store,
  Clock,
  Zap,
  ZoomIn,
  Heart,
  X,
  Sparkles,
  Cpu,
  Lock,
  FileCheck,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function ProductDetailPage() {
  const routeParams = useParams();
  const router = useRouter();
  const { addToCart, isInCart, openCart } = useCart();

  const itemId = routeParams?.itemId || null;

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [zoomLightboxOpen, setZoomLightboxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && itemId) {
      const stored = localStorage.getItem('unretail_saved_grails');
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids) && ids.includes(itemId)) setIsSaved(true);
        } catch (e) {}
      }
    }
  }, [itemId]);

  const toggleSave = () => {
    if (typeof window !== 'undefined' && itemId) {
      const stored = localStorage.getItem('unretail_saved_grails');
      let ids = stored ? JSON.parse(stored) : [];
      if (ids.includes(itemId)) {
        ids = ids.filter((id) => id !== itemId);
        setIsSaved(false);
      } else {
        ids.push(itemId);
        setIsSaved(true);
      }
      localStorage.setItem('unretail_saved_grails', JSON.stringify(ids));
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await apiClient.get(`/items/${itemId}`);
      if (res.data?.data) {
        setItem(res.data.data);
      } else {
        setFetchError('Product not found or has been unlisted.');
      }
    } catch (err) {
      console.warn('Failed to load item details:', err);
      setFetchError(err.response?.data?.error || 'Product not found in catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!item) return;
    if (item.status === 'SOLD') return;
    addToCart(item, false);
    router.push('/checkout');
  };

  const handleAddToBag = () => {
    if (!item) return;
    addToCart(item, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 p-8 max-w-7xl mx-auto flex items-center justify-center text-sm">
        <div className="animate-pulse flex items-center gap-2 text-zinc-400">
          <Sparkles className="w-4 h-4 text-neon-lime animate-spin" />
          <span>Loading Item Specifications...</span>
        </div>
      </div>
    );
  }

  if (fetchError || !item) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 p-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <Tag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-md">
          {fetchError || 'The product you are looking for does not exist or has been removed from the catalog.'}
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-lime hover:bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md mt-2"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Catalog Feed
        </Link>
      </div>
    );
  }

  const images =
    item?.images && item.images.length > 0
      ? item.images
      : ['/images/denim_vintage.png', '/images/leather_jacket.png'];

  const isTech = isTechCategory(item?.category);

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" /> Back
          </button>
          <span>/</span>
          <Link href="/feed" className="hover:text-neon-lime transition-colors">
            Catalog Feed
          </Link>
          <span>/</span>
          <Link
            href={`/feed`}
            className="hover:text-neon-lime transition-colors font-medium text-zinc-300"
          >
            {item?.category || 'Apparel'}
          </Link>
          {item?.subcategory && (
            <>
              <span>/</span>
              <span className="text-neon-lime font-medium">{item.subcategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden relative shadow-2xl group">
            <img
              src={images[selectedImage] || '/images/denim_vintage.png'}
              alt={item?.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/denim_vintage.png';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              onClick={() => setZoomLightboxOpen(true)}
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
              <span className="bg-neon-lime text-black font-bold text-xs px-3 py-1 rounded-full shadow-md">
                {item?.status === 'SOLD' ? 'Sold Out' : 'Available In-Store & Online'}
              </span>
              {isTech && (
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Escrow Anti-Fraud Lock
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={toggleSave}
                className={`p-2.5 rounded-full border backdrop-blur-md transition-all shadow-md ${
                  isSaved
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-black/70 text-zinc-300 border-zinc-700/80 hover:text-white hover:border-white'
                }`}
                title={isSaved ? 'Saved to Watchlist' : 'Save Grail'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setZoomLightboxOpen(true)}
                className="bg-black/70 hover:bg-white hover:text-black text-zinc-300 border border-zinc-700/80 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md"
                title="Zoom Lightbox"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 shrink-0 bg-zinc-950 border rounded-xl overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-neon-lime ring-2 ring-neon-lime/40'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl || '/images/denim_vintage.png'}
                    alt={`Thumbnail ${idx}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/denim_vintage.png';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700/80 text-neon-lime rounded-full text-xs font-medium">
              <Zap className="w-3.5 h-3.5 fill-neon-lime" />
              <span>Authentic Physical Rack Item</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {item?.title}
            </h1>
            <div className="text-3xl font-bold text-white tracking-tight tabular-nums pt-1">
              {formatCurrency(item?.price || 0)}
            </div>
          </div>

          {/* Attribute Specs Grid */}
          <div className="grid grid-cols-2 gap-3 bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 text-xs shadow-lg backdrop-blur-sm">
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">
                {isTech ? 'Tech Grade' : 'Condition'}
              </span>
              <span className="font-semibold text-emerald-400 text-sm">
                {isTech && item?.techConditionGrade
                  ? item.techConditionGrade
                  : formatCondition(item?.condition)}
              </span>
            </div>
            {item?.category !== 'Accessories' && (
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">
                  {isTech ? 'Form Factor' : 'Size Tag'}
                </span>
                <span className="font-semibold text-white text-sm">{item?.size || 'OS'}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Category</span>
              <span className="font-semibold text-white text-sm">{item?.category || 'Apparel'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Subcategory</span>
              <span className="font-semibold text-amber-300 text-sm">{item?.subcategory || 'Vintage Core'}</span>
            </div>
          </div>

          {/* Dedicated Tech Anti-Fraud & Hardware Verification Report */}
          {isTech && (
            <div className="bg-gradient-to-b from-cyan-950/40 via-zinc-950/80 to-zinc-950 border border-cyan-500/30 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs backdrop-blur-sm">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div className="font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Hardware Telemetry & Anti-Fraud Report</span>
                </div>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  Verified In-Store
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-zinc-200">Power-On Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-zinc-200">Screen / Lens Clear</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-zinc-200">Ports & Circuit OK</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-zinc-200 font-mono text-[11px]">
                    {maskSerialNumber(item?.serialNumberImei)}
                  </span>
                </div>
              </div>

              {item?.knownDefectsDesc && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                  <strong>Disclosed Patina:</strong> {item.knownDefectsDesc}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Curator Description</h3>
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/70 p-4 border border-zinc-800/80 rounded-2xl">
              {item?.description}
            </p>
          </div>

          {/* Merchant Vendor Card */}
          <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-3 text-xs shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Verified Storefront</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold">
                In-Store Sync Active
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-700/80 rounded-xl flex items-center justify-center text-neon-lime shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {item?.shop?.shopName || 'Relic Vintage Co.'}
                  <ShieldCheck className="w-4 h-4 text-neon-lime" />
                </h4>
                <div className="text-zinc-400 flex items-center gap-1 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>
                    {item?.shop?.address || '42 Bandra West, Hill Road'}, {item?.shop?.city || 'Mumbai'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Checkout & Bag Action CTAs */}
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToBag}
                disabled={item?.status === 'SOLD'}
                className={`py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all border ${
                  isInCart(item?.id)
                    ? 'bg-zinc-900 border-neon-lime text-neon-lime shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-white hover:border-zinc-500'
                } active:scale-95 disabled:opacity-50 cursor-pointer`}
              >
                {isInCart(item?.id) ? (
                  <>
                    <Check className="w-4 h-4 text-neon-lime" />
                    <span>In Your Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCheckout}
                disabled={item?.status === 'SOLD'}
                className="bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(204,255,0,0.35)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <span>{item?.status === 'SOLD' ? 'Sold Out' : 'Instant Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 text-center font-medium">
              100% Escrow Protection • 48-Hour Inspection Window on Delivery
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Success Dialog */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-street-card border border-neon-lime/60 rounded-2xl w-full max-w-md p-6 text-center space-y-4 shadow-2xl relative"
            >
              <div className="w-12 h-12 bg-neon-lime/15 text-neon-lime rounded-full border border-neon-lime/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-zinc-400">
                Your payment order has been created and verified on Razorpay escrow.
              </p>
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order ID:</span>
                  <span className="text-white font-mono font-semibold">{orderSuccess.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Razorpay Order ID:</span>
                  <span className="text-neon-lime font-mono font-semibold">{orderSuccess.razorpayOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount Paid:</span>
                  <span className="text-white font-bold">{formatCurrency(orderSuccess.amount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/orders"
                  className="flex-1 bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
                >
                  Track In My Orders
                </Link>
                <button
                  onClick={() => setOrderSuccess(null)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs uppercase py-3 px-4 rounded-xl border border-zinc-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Zoom Lightbox Modal */}
      {zoomLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomLightboxOpen(false)}
        >
          <button
            onClick={() => setZoomLightboxOpen(false)}
            className="absolute top-6 right-6 bg-zinc-900 text-white p-3 rounded-full border border-zinc-700 hover:border-neon-lime transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedImage] || '/images/denim_vintage.png'}
            alt={item?.title}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-2xl border border-zinc-800"
          />
        </div>
      )}
    </div>
  );
}
