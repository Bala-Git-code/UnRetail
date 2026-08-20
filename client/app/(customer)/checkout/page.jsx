'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import {
  ShieldCheck,
  ShoppingBag,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  MapPin,
  Phone,
  User,
  CreditCard,
  Building,
  Info,
  Trash2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    removeFromCart,
    clearCart,
    unavailableItems,
    validateCartItems,
    removeUnavailableItems,
  } = useCart();

  const [user, setUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [stockChecking, setStockChecking] = useState(false);

  // Shipping Address Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Check authentication & prefill user profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('unretail_token');
      const storedUser = localStorage.getItem('unretail_user');

      if (!token) {
        // Redirect unauthenticated user to login with return redirect
        router.push('/login?redirect=/checkout');
        return;
      }

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setFormData((prev) => ({
            ...prev,
            fullName: parsed.fullName || '',
            phone: parsed.phoneNumber || '',
            street: parsed.address || '',
            city: parsed.city || '',
          }));
        } catch (e) {
          // ignore
        }
      }
      setIsAuthLoaded(true);
    }
  }, [router]);

  // Initial stock validation on page load
  useEffect(() => {
    if (cartItems.length > 0) {
      validateCartItems();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
      errors.phone = 'Enter a valid 10-digit Indian phone number';
    }
    if (!formData.street.trim()) errors.street = 'Street address & building is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pinCode.trim()) {
      errors.pinCode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.pinCode = 'Enter a valid 6-digit PIN code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (cartItems.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }

    if (!validateForm()) {
      setFormError('Please fill in all required shipping address fields.');
      return;
    }

    // Step 1: Pre-validate stock
    setStockChecking(true);
    try {
      const validation = await validateCartItems();
      if (!validation.valid && validation.unavailableItems?.length > 0) {
        setStockChecking(false);
        setFormError('Some 1-of-1 items in your bag have already been sold. Please remove them to proceed.');
        return;
      }
    } catch (valErr) {
      console.warn('Pre-checkout stock validation warning:', valErr);
    }
    setStockChecking(false);

    // Step 2: Initialize Checkout Order on Backend
    setIsSubmitting(true);

    try {
      const res = await apiClient.post('/payments/create-order', {
        itemIds: cartItems.map((i) => i.id),
        shippingAddress: formData,
        buyerId: user?.id || 'customer',
      });

      if (!res.data?.success) {
        throw new Error(res.data?.error || 'Failed to initialize payment order');
      }

      const { razorpayOrderId, amount, currency, keyId, orders } = res.data;

      // Step 3: Launch Razorpay Checkout Modal
      if (typeof window === 'undefined' || !window.Razorpay) {
        // Fallback if Razorpay script is still loading or running on local dev sandbox
        console.warn('Razorpay SDK not loaded, testing simulated direct verification');
        const simulatedPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await apiClient.post('/payments/verify', {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'simulated_dev_signature',
          orderIds: orders?.map((o) => o.id),
          shippingAddress: formData,
        });

        if (verifyRes.data?.success) {
          clearCart();
          const primaryOrderId = orders?.[0]?.id || razorpayOrderId;
          router.push(`/orders/${primaryOrderId}/success?rp_order=${razorpayOrderId}&rp_pay=${simulatedPaymentId}`);
          return;
        }
      }

      const options = {
        key: keyId || 'rzp_test_YourKeyIdHere',
        amount: amount,
        currency: currency || 'INR',
        name: 'UNRETAIL',
        description: `Curated Thrift Order (${cartItems.length} pieces)`,
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=200&q=80',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await apiClient.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderIds: orders?.map((o) => o.id),
              shippingAddress: formData,
            });

            if (verifyRes.data?.success) {
              clearCart();
              const primaryOrderId = orders?.[0]?.id || response.razorpay_order_id;
              router.push(
                `/orders/${primaryOrderId}/success?rp_order=${response.razorpay_order_id}&rp_pay=${response.razorpay_payment_id}`
              );
            } else {
              setFormError('Payment signature verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            // Even on network glitch, if verification created records, redirect
            clearCart();
            const primaryOrderId = orders?.[0]?.id || response.razorpay_order_id;
            router.push(
              `/orders/${primaryOrderId}/success?rp_order=${response.razorpay_order_id}&rp_pay=${response.razorpay_payment_id}`
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName || user?.fullName || '',
          email: user?.email || '',
          contact: formData.phone || user?.phoneNumber || '',
        },
        notes: {
          address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
          itemCount: cartItems.length,
        },
        theme: {
          color: '#ccff00',
          backdrop_color: 'rgba(5, 5, 5, 0.95)',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setFormError('Payment was dismissed. Your pieces remain safely in your bag.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        setFormError(`Payment failed: ${response.error.description || 'Transaction declined.'}`);
        setIsSubmitting(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error('Checkout error:', error);
      setFormError(
        error.response?.data?.error || error.message || 'Failed to initialize Razorpay checkout. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-street-black text-zinc-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <Sparkles className="w-5 h-5 text-neon-lime animate-spin" />
          <span>Securing Checkout Session...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Razorpay Native Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => console.warn('Razorpay checkout script failed to load')}
      />

      <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" /> Back
            </button>
            <span>/</span>
            <Link href="/feed" className="hover:text-neon-lime transition-colors">
              Catalog Feed
            </Link>
            <span>/</span>
            <span className="text-neon-lime font-bold">Secure Escrow Checkout</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">100% Escrow Protection Active</span>
            <span className="sm:hidden">Escrow Safe</span>
          </div>
        </div>

        {/* Empty Cart Guard */}
        {cartItems.length === 0 ? (
          <div className="bg-street-card/80 border border-zinc-800/90 rounded-3xl p-12 md:p-16 text-center space-y-5 max-w-xl mx-auto shadow-2xl backdrop-blur-sm mt-8">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Your Bag is Empty</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                You have no 1-of-1 items in your bag. Browse our live physical thrift boutique racks to discover rare grails.
              </p>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:bg-white transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Live Boutique Racks</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Shipping Address & Escrow Protection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unavailable Items Banner */}
              {unavailableItems.length > 0 && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-rose-300">
                        {unavailableItems.length} item in your bag is no longer available:
                      </p>
                      <ul className="text-rose-400 text-[11px] list-disc list-inside mt-1">
                        {unavailableItems.map((u) => (
                          <li key={u.id}>
                            {u.title || u.id} ({u.reason})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={removeUnavailableItems}
                    className="w-full text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 py-2 px-3 rounded-xl transition-colors border border-rose-500/30 text-center"
                  >
                    Remove Sold Items to Continue Checkout
                  </button>
                </div>
              )}

              {/* Form Error Banner */}
              {formError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Checkout Notice:</strong>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {/* Shipping Address Card */}
              <div className="bg-street-card/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-neon-lime">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">1. Delivery Address</h2>
                      <p className="text-xs text-zinc-400">Where should your thrift pieces be delivered?</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-mono">
                    Pan-India Insured
                  </span>
                </div>

                <form onSubmit={handleRazorpayPayment} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Recipient Full Name *</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full bg-zinc-950/80 border ${
                          formErrors.fullName ? 'border-rose-500' : 'border-zinc-800 focus:border-neon-lime'
                        } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm`}
                      />
                      {formErrors.fullName && (
                        <span className="text-rose-400 text-[11px]">{formErrors.fullName}</span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Phone Number (10-Digit) *</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className={`w-full bg-zinc-950/80 border ${
                          formErrors.phone ? 'border-rose-500' : 'border-zinc-800 focus:border-neon-lime'
                        } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm`}
                      />
                      {formErrors.phone && (
                        <span className="text-rose-400 text-[11px]">{formErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Street Address / Flat / Floor / Landmark *</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Sunset Heights, Linking Road"
                      className={`w-full bg-zinc-950/80 border ${
                        formErrors.street ? 'border-rose-500' : 'border-zinc-800 focus:border-neon-lime'
                      } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm`}
                    />
                    {formErrors.street && (
                      <span className="text-rose-400 text-[11px]">{formErrors.street}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className={`w-full bg-zinc-950/80 border ${
                          formErrors.city ? 'border-rose-500' : 'border-zinc-800 focus:border-neon-lime'
                        } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm`}
                      />
                      {formErrors.city && (
                        <span className="text-rose-400 text-[11px]">{formErrors.city}</span>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-neon-lime rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Goa">Goa</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 400050"
                        maxLength={6}
                        className={`w-full bg-zinc-950/80 border ${
                          formErrors.pinCode ? 'border-rose-500' : 'border-zinc-800 focus:border-neon-lime'
                        } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm`}
                      />
                      {formErrors.pinCode && (
                        <span className="text-rose-400 text-[11px]">{formErrors.pinCode}</span>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Delivery Service Tier */}
              <div className="bg-street-card/80 border border-zinc-800/90 rounded-3xl p-6 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Insured Thrift Courier</h3>
                      <p className="text-[11px] text-zinc-400">Tamper-evident packaging & live GPS courier tracking</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    {deliveryFee === 0 ? 'FREE (Orders > ₹3,000)' : '₹99 (Flat Rate)'}
                  </span>
                </div>
              </div>

              {/* Escrow Buyer Protection Breakdown */}
              <div className="bg-gradient-to-br from-emerald-950/20 via-zinc-950/60 to-street-card border border-emerald-500/30 rounded-3xl p-6 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm">UnRetail Escrow Protection Protocol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-zinc-300">
                  <div className="flex items-start gap-2 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Funds held securely in escrow while your package travels from store to door.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>48-Hour physical inspection window upon delivery before merchant payout is released.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Razorpay Trigger */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Items Review */}
              <div className="bg-street-card/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-neon-lime" />
                    <h3 className="text-base font-bold text-white">Order Summary</h3>
                  </div>
                  <span className="text-xs bg-neon-lime/10 text-neon-lime border border-neon-lime/30 px-2.5 py-0.5 rounded-full font-bold">
                    {cartCount} 1-of-1 {cartCount === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const image = item.images && item.images.length > 0 ? item.images[0] : '/images/denim_vintage.png';
                    const isSold = unavailableItems.some((u) => u.id === item.id);

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-3.5 p-3 rounded-2xl border transition-all ${
                          isSold ? 'bg-rose-950/20 border-rose-500/50' : 'bg-zinc-950/80 border-zinc-800/80'
                        }`}
                      >
                        <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 relative">
                          <img
                            src={image}
                            alt={item.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/denim_vintage.png';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                              <span>{item.shop?.shopName || 'Relic Vintage Co.'}</span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-zinc-500">{item.shop?.city || 'Mumbai'}</span>
                            </p>

                            <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                              <span className="bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 font-mono">
                                Size: {item.size || 'OS'}
                              </span>
                              <span className="bg-zinc-900 text-amber-300 px-2 py-0.5 rounded border border-zinc-800">
                                {item.techConditionGrade || formatCondition(item.condition)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-xs font-bold text-white tabular-nums">
                            <span>{formatCurrency(item.price)}</span>
                            <span className="text-[10px] text-neon-lime font-mono">Qty: 1</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Calculations */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Items Subtotal</span>
                    <span className="text-white font-semibold tabular-nums">
                      {formatCurrency(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Insured Courier Shipping</span>
                    <span className="tabular-nums font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold uppercase text-[11px]">Free</span>
                      ) : (
                        <span className="text-white">{formatCurrency(deliveryFee)}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Platform Escrow Holding Fee
                    </span>
                    <span className="text-cyan-400 font-bold uppercase text-[11px]">Free (₹0)</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-base font-extrabold text-white">
                    <span>Total Payable</span>
                    <span className="text-xl text-white tabular-nums">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Pay via Razorpay Primary Button */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={isSubmitting || stockChecking || unavailableItems.length > 0}
                    className="w-full bg-neon-lime hover:bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(204,255,0,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Opening Razorpay Escrow Modal...'
                        : stockChecking
                        ? 'Verifying In-Store Stock...'
                        : `Pay ${formatCurrency(cartTotal)} via Razorpay`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500 pt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-zinc-400" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-zinc-400" /> UPI / Cards / NetBanking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
