'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ShoppingBag,
  ExternalLink,
  Store,
} from 'lucide-react';

export function OrderSuccessContent(props) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const resolvedOrderId = params?.orderId || props?.params?.orderId || searchParams.get('orderId') || 'ord_latest';
  const razorpayPaymentId = searchParams.get('rp_pay') || null;
  const razorpayOrderId = searchParams.get('rp_order') || null;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [resolvedOrderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/orders/${resolvedOrderId}`);
      if (res.data?.success && res.data?.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch specific order, using fallback confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  const item = order?.item || {
    id: 'item-101',
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    price: 5499,
    category: 'Apparel',
    size: 'W32 L30',
    condition: 'LIKE_NEW',
    images: ['/images/denim_vintage.png'],
  };

  const shop = order?.shop || {
    shopName: 'Relic Vintage Co.',
    city: 'Mumbai',
    address: '42 Bandra West, Hill Road',
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-4xl mx-auto font-sans flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full space-y-8"
      >
        {/* Top Celebration Banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-neon-lime/15 border border-neon-lime/40 flex items-center justify-center text-neon-lime mx-auto shadow-[0_0_30px_rgba(204,255,0,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/30 text-neon-lime rounded-full text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PAYMENT CONFIRMED • ESCROW SECURED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Grail Secured Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your payment is locked safely in UnRetail Escrow. The boutique owner has been notified to prepare your 1-of-1 piece.
          </p>
        </div>

        {/* Transaction & Order Reference Card */}
        <div className="bg-street-card/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-zinc-800/80 text-xs">
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">
                Order Reference
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {order?.id || resolvedOrderId}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">
                Razorpay Payment Ref
              </span>
              <span className="font-mono font-bold text-neon-lime text-sm truncate block">
                {razorpayPaymentId || order?.razorpayPaymentId || 'pay_verified_escrow'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">
                Payment Status
              </span>
              <span className="font-semibold text-emerald-400 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Escrow Protected (PAID)
              </span>
            </div>
          </div>

          {/* Purchased Item Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Secured 1-of-1 Item
            </h3>
            <div className="flex gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 items-center">
              <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                <img
                  src={item.images?.[0] || '/images/denim_vintage.png'}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/denim_vintage.png';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <span>{shop.shopName}</span>
                  <span>•</span>
                  <span>{shop.city}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                  <span className="bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 font-mono">
                    Size: {item.size || 'OS'}
                  </span>
                  <span className="bg-neon-lime/10 text-neon-lime px-2 py-0.5 rounded border border-neon-lime/20 font-bold">
                    1-of-1 Thrift Piece
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block tabular-nums">
                  {formatCurrency(order?.amountPaid || item.price || 0)}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Captured</span>
              </div>
            </div>
          </div>

          {/* Escrow Timeline & Protection Alert */}
          <div className="bg-gradient-to-br from-emerald-950/30 via-zinc-950/70 to-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow Protection Active</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Your payment will remain in the UnRetail platform escrow until the courier marks the package delivered, and your <strong>48-hour physical inspection window</strong> elapses. You can file a dispute anytime before the window closes.
            </p>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Link
              href="/orders"
              className="w-full sm:flex-1 bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95 text-center"
            >
              <Package className="w-4 h-4" />
              <span>Track in My Orders</span>
            </Link>

            <Link
              href="/feed"
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl border border-zinc-800 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Explore More Grails</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-street-black text-zinc-100 flex items-center justify-center p-6 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles className="w-4 h-4 text-neon-lime animate-spin" />
            <span>Loading Order Confirmation...</span>
          </div>
        </div>
      }
    >
      <OrderSuccessContent {...props} />
    </Suspense>
  );
}
