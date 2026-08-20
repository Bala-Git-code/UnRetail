'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition, maskSerialNumber } from '@/lib/utils';
import {
  TAXONOMY,
  getSubcategories,
  isTechCategory,
  TECH_CONDITION_GRADES,
} from '@/lib/taxonomy';
import {
  Eye,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cpu,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

export default function FeedPage() {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [purchasing, setPurchasing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [savedGrailIds, setSavedGrailIds] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unretail_saved_grails');
      if (stored) {
        try {
          setSavedGrailIds(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const toggleSaveGrail = (itemId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedGrailIds((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('unretail_saved_grails', JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedSubcategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedSubcategory !== 'ALL') params.append('subcategory', selectedSubcategory);

      const response = await apiClient.get(`/items?${params.toString()}`);
      if (response.data?.data) {
        setItems(response.data.data);
      }
    } catch (err) {
      console.warn('Fallback items loaded:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('ALL');
  };

  const handleNextImage = (itemId, maxImages, e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % maxImages,
    }));
  };

  const handlePrevImage = (itemId, maxImages, e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + maxImages) % maxImages,
    }));
  };

  const handleBuyNow = (item) => {
    if (!item || item.status === 'SOLD') return;
    addToCart(item, false);
    router.push('/checkout');
  };

  const handleAddToBag = (item, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!item || item.status === 'SOLD') return;
    addToCart(item, true);
  };

  const currentSubcategories = selectedCategory !== 'ALL' ? getSubcategories(selectedCategory) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Top Banner & Category Filter Ticker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-6 border-b border-zinc-800/80 gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tier Curated Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Catalog Racks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Real-time physical inventory continuously synced across verified boutique racks and vintage tech vaults.
          </p>
        </div>

        {/* Tier-1 Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 select-none">
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-neon-lime text-black shadow-[0_0_16px_rgba(204,255,0,0.35)] font-bold'
                : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
            }`}
          >
            All Vault Items
          </button>
          {TAXONOMY.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? cat.id === 'Tech & Retro Electronics'
                      ? 'bg-cyan-400 text-black shadow-[0_0_16px_rgba(6,182,212,0.35)] font-bold'
                      : 'bg-neon-lime text-black shadow-[0_0_16px_rgba(204,255,0,0.35)] font-bold'
                    : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {cat.id === 'Tech & Retro Electronics' && <Cpu className="w-3.5 h-3.5" />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier-2 Nested Subcategory Filter Drawer */}
      <AnimatePresence>
        {selectedCategory !== 'ALL' && currentSubcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden mb-8"
          >
            <div className="p-4 bg-street-card/80 border border-zinc-800/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-xs text-zinc-400 shrink-0 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neon-lime" />
                <span>Filter Subcategories:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedSubcategory('ALL')}
                  className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                    selectedSubcategory === 'ALL'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  All {selectedCategory === 'Tech & Retro Electronics' ? 'Tech' : selectedCategory}
                </button>
                {currentSubcategories.map((sub) => {
                  const isSubActive = selectedSubcategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                        isSubActive
                          ? 'bg-neon-lime text-black font-bold shadow-sm shadow-neon-lime/20'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-street-card/80 border border-zinc-800 rounded-2xl h-[460px] overflow-hidden flex flex-col justify-between p-5 space-y-4 animate-pulse shadow-xl"
            >
              <div className="aspect-[4/5] bg-zinc-900 rounded-xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
                <div className="h-3 bg-zinc-900 rounded-md w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
                <div className="h-6 bg-zinc-800 rounded-md w-1/3" />
                <div className="h-8 bg-zinc-800 rounded-xl w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-16 text-center space-y-4 shadow-xl">
          <Tag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Matching Rack Items Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            There are currently no active listings for this subcategory. Select another filter or view all catalog items.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedSubcategory('ALL');
            }}
            className="bg-neon-lime text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:bg-white transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => {
            const images = item.images && item.images.length > 0 ? item.images : ['/images/denim_vintage.png'];
            const curImgIdx = activeImageIndex[item.id] || 0;
            const isItemTech = isTechCategory(item.category);

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="group bg-street-card/80 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden card-hover-effect shadow-xl backdrop-blur-sm"
              >
                {/* Image Carousel Block */}
                <div className="relative aspect-[4/5] bg-zinc-950 border-b border-zinc-800/80 overflow-hidden">
                  <img
                    src={images[curImgIdx] || '/images/denim_vintage.png'}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/denim_vintage.png';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Carousel Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevImage(item.id, images.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextImage(item.id, images.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              idx === curImgIdx ? 'bg-neon-lime' : 'bg-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Category / Subcategory Overlay */}
                  {item.subcategory && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                      <span className="bg-black/75 text-zinc-300 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-700/80 backdrop-blur-md">
                        {item.subcategory}
                      </span>
                    </div>
                  )}

                  {/* Quick View Button */}
                  <button
                    onClick={() => setQuickViewItem(item)}
                    className="absolute bottom-3 right-3 bg-zinc-900/90 hover:bg-white hover:text-black text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> Quick View
                  </button>
                </div>

                {/* Card Content Footer */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-medium">
                      <span className="flex items-center gap-1 text-zinc-300">
                        {item.shop?.shopName || 'Relic Vintage Co.'}
                        {item.shop?.isVerified !== false && (
                          <ShieldCheck className="w-3.5 h-3.5 text-neon-lime inline" />
                        )}
                      </span>
                      <span className="text-zinc-500">{item.shop?.city || 'Mumbai'}</span>
                    </div>

                    <Link href={`/item/${item.id}`}>
                      <h3 className="text-base font-semibold text-white tracking-tight line-clamp-1 hover:text-neon-lime transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Buy Action */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Price</span>
                      <span className="text-xl font-bold text-white tracking-tight tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleAddToBag(item, e)}
                        disabled={item.status === 'SOLD'}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isInCart(item.id)
                            ? 'bg-zinc-900 border-neon-lime text-neon-lime'
                            : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                        } active:scale-95 disabled:opacity-50 cursor-pointer`}
                        title={isInCart(item.id) ? 'In Your Bag' : 'Add to Bag'}
                      >
                        {isInCart(item.id) ? <Check className="w-4 h-4 text-neon-lime" /> : <ShoppingBag className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleBuyNow(item)}
                        disabled={item.status === 'SOLD'}
                        className="bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <span>{item.status === 'SOLD' ? 'Sold Out' : 'Buy Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {quickViewItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-street-card border border-zinc-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative font-sans shadow-2xl"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative shadow-lg">
                  <img
                    src={
                      quickViewItem.images && quickViewItem.images.length > 0
                        ? quickViewItem.images[0]
                        : '/images/denim_vintage.png'
                    }
                    alt={quickViewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-lime/10 text-neon-lime border border-neon-lime/30 rounded-full text-xs font-medium">
                      <Tag className="w-3.5 h-3.5" /> Specifications Sheet
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                      {quickViewItem.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {quickViewItem.techConditionGrade ? (
                        <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-full text-cyan-300 font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> {quickViewItem.techConditionGrade}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                          Condition: <strong className="text-white">{formatCondition(quickViewItem.condition)}</strong>
                        </span>
                      )}
                      {quickViewItem.category !== 'Accessories' && (
                        <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                          {isTechCategory(quickViewItem.category) ? 'Form Factor: ' : 'Size: '}
                          <strong className="text-white">{quickViewItem.size || 'OS'}</strong>
                        </span>
                      )}
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                        Era: <strong className="text-white">{quickViewItem.era || '90s'}</strong>
                      </span>
                    </div>

                    {/* Tech Verification Details */}
                    {isTechCategory(quickViewItem.category) && (
                      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-3 text-xs space-y-1.5 text-cyan-300">
                        <div className="font-bold flex items-center gap-1.5 text-white">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>4-Point Diagnostic Report Verified</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-300 pt-1">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Power-on Verified
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Optics / Sensor Clear
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ports / Charging OK
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-cyan-400" /> Escrow Serial Locked
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                      {quickViewItem.description}
                    </p>

                    <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="text-zinc-500 font-medium">Sold By Verified Vendor:</div>
                      <div className="text-white font-semibold flex items-center gap-1.5">
                        {quickViewItem.shop?.shopName || 'Relic Vintage Co.'}
                        <ShieldCheck className="w-4 h-4 text-neon-lime" />
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        {quickViewItem.shop?.address || 'Bandra West, Mumbai'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Total Price</span>
                      <span className="text-2xl font-bold text-white tracking-tight tabular-nums">
                        {formatCurrency(quickViewItem.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const itemToBag = quickViewItem;
                          setQuickViewItem(null);
                          handleAddToBag(itemToBag);
                        }}
                        disabled={quickViewItem.status === 'SOLD'}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                          isInCart(quickViewItem.id)
                            ? 'bg-zinc-900 border-neon-lime text-neon-lime'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
                        }`}
                      >
                        {isInCart(quickViewItem.id) ? 'In Bag' : 'Add to Bag'}
                      </button>

                      <button
                        onClick={() => {
                          const itemToBuy = quickViewItem;
                          setQuickViewItem(null);
                          handleBuyNow(itemToBuy);
                        }}
                        disabled={quickViewItem.status === 'SOLD'}
                        className="bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        Instant Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Order Success Modal */}
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
                Escrow order hold initiated for &quot;{orderSuccess.itemTitle}&quot;.
              </p>
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order Ref ID:</span>
                  <span className="text-white font-mono font-semibold">{orderSuccess.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Razorpay ID:</span>
                  <span className="text-neon-lime font-mono font-semibold">{orderSuccess.razorpayOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total:</span>
                  <span className="text-white font-bold">{formatCurrency(orderSuccess.amount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/orders"
                  className="flex-1 bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
                >
                  Track in My Orders
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
    </div>
  );
}
