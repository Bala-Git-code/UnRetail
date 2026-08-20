'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { formatCurrency, formatCondition } from '@/lib/utils';
import {
  ShoppingBag,
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Store,
  Sparkles,
  AlertTriangle,
  Lock,
  Truck,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    clearCart,
    unavailableItems,
    removeUnavailableItems,
    cartNotification,
    validateCartItems,
    isValidating,
  } = useCart();

  // Validate cart stock when drawer opens
  useEffect(() => {
    if (isCartOpen && cartItems.length > 0) {
      validateCartItems();
    }
  }, [isCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  const isFreeDelivery = cartSubtotal >= 3000;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Pure Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-street-black border-l border-zinc-800 shadow-2xl flex flex-col pointer-events-auto text-zinc-100"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-zinc-800/80 bg-street-dark/80 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-neon-lime">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2 uppercase">
                      <span>Shopping Bag</span>
                      {cartCount > 0 && (
                        <span className="text-[11px] bg-neon-lime text-black font-bold px-2 py-0.5 rounded-full font-mono">
                          {cartCount} {cartCount === 1 ? 'PIECE' : 'PIECES'}
                        </span>
                      )}
                    </h2>
                    <p className="text-[11px] text-zinc-400">1-of-1 Thrift & Vintage Vault</p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-zinc-700"
                  aria-label="Close Bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notification Toast Banner */}
              <AnimatePresence>
                {cartNotification && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 border-b ${
                      cartNotification.type === 'error'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : cartNotification.type === 'warning'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-neon-lime/15 text-neon-lime border-neon-lime/30'
                    }`}
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cartNotification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unavailable Items Warning Alert */}
              {unavailableItems.length > 0 && (
                <div className="mx-6 mt-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-rose-300">
                        {unavailableItems.length} {unavailableItems.length === 1 ? 'item was' : 'items were'} sold out:
                      </p>
                      <ul className="text-rose-400/90 text-[11px] list-disc list-inside mt-1 space-y-0.5">
                        {unavailableItems.map((u) => (
                          <li key={u.id} className="truncate">
                            {u.title || u.id} ({u.reason})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={removeUnavailableItems}
                    className="w-full text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 py-1.5 px-3 rounded-xl transition-colors border border-rose-500/30 text-center"
                  >
                    Remove Sold Items From Bag
                  </button>
                </div>
              )}

              {/* Drawer Content / Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-5">
                    <div className="w-20 h-20 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-600 shadow-inner">
                      <ShoppingBag className="w-10 h-10 text-zinc-500" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h3 className="text-lg font-bold text-white tracking-tight">Your Bag is Empty</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Thrift pieces are one-of-a-kind. Explore live boutique racks and vintage tech vaults before grails sell out.
                      </p>
                    </div>
                    <Link
                      href="/feed"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 bg-neon-lime text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:bg-white transition-all active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Explore Curated Catalog</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const isItemUnavailable = unavailableItems.some((u) => u.id === item.id);
                      const image = item.images && item.images.length > 0 ? item.images[0] : '/images/denim_vintage.png';

                      return (
                        <div
                          key={item.id}
                          className={`relative group bg-street-card/90 border rounded-2xl p-3.5 transition-all flex gap-3.5 shadow-sm ${
                            isItemUnavailable
                              ? 'border-rose-500/50 bg-rose-950/10 opacity-75'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {/* Item Thumbnail */}
                          <Link
                            href={`/item/${item.id}`}
                            onClick={closeCart}
                            className="w-20 h-24 rounded-xl bg-zinc-950 border border-zinc-800/80 overflow-hidden shrink-0 relative block"
                          >
                            <img
                              src={image}
                              alt={item.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/denim_vintage.png';
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.size && (
                              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                                {item.size}
                              </span>
                            )}
                          </Link>

                          {/* Item Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/item/${item.id}`}
                                  onClick={closeCart}
                                  className="text-xs font-bold text-white hover:text-neon-lime transition-colors line-clamp-1"
                                >
                                  {item.title}
                                </Link>

                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-zinc-500 hover:text-rose-400 p-1 transition-colors rounded-lg hover:bg-zinc-800"
                                  title="Remove from Bag"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                                <span className="text-zinc-300 font-medium truncate max-w-[130px]">
                                  {item.shop?.shopName || 'Relic Vintage Co.'}
                                </span>
                                {item.shop?.isVerified !== false && (
                                  <ShieldCheck className="w-3 h-3 text-neon-lime shrink-0" />
                                )}
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-500">{item.shop?.city || 'Mumbai'}</span>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-1.5">
                                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {item.techConditionGrade || formatCondition(item.condition)}
                                </span>
                                <span className="bg-neon-lime/10 text-neon-lime border border-neon-lime/20 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> 1-of-1
                                </span>
                              </div>
                            </div>

                            {/* Price and Stock Notice */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-2">
                              <span className="text-xs font-bold text-white tracking-tight tabular-nums">
                                {formatCurrency(item.price)}
                              </span>

                              <span className="text-[10px] text-zinc-500 font-medium">
                                Qty: 1 (Single Piece)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Sticky Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-zinc-800 bg-street-dark/95 backdrop-blur-xl space-y-4">
                  {/* Shipping & Escrow Guarantee Summary */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Items Subtotal</span>
                      <span className="text-white font-semibold tabular-nums">
                        {formatCurrency(cartSubtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Insured Delivery</span>
                      </span>
                      <span className="tabular-nums font-semibold">
                        {isFreeDelivery ? (
                          <span className="text-emerald-400 font-bold uppercase text-[11px]">Free</span>
                        ) : (
                          <span className="text-zinc-200">{formatCurrency(deliveryFee)}</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Escrow Buyer Protection</span>
                      </span>
                      <span className="text-cyan-400 font-bold text-[11px] uppercase">Free (100% Covered)</span>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
                      <span>Estimated Total</span>
                      <span className="text-lg text-white tabular-nums">
                        {formatCurrency(cartTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Trust Micro-Banner */}
                  <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Funds locked safely in escrow until delivery and 48-hour physical inspection window.
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      disabled={unavailableItems.length > 0 || isValidating}
                      className="w-full bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={clearCart}
                      className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-300 py-1 transition-colors font-medium"
                    >
                      Clear Bag
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
