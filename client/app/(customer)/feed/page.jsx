'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { Eye, ArrowRight, ShieldCheck, Tag, ShoppingBag, X, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';

export default function FeedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [purchasing, setPurchasing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [savedGrailIds, setSavedGrailIds] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unretail_saved_grails');
      if (stored) {
        try { setSavedGrailIds(JSON.parse(stored)); } catch (e) {}
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
  }, [selectedCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : '';
      const response = await apiClient.get(`/items${categoryParam}`);
      if (response.data?.data) {
        setItems(response.data.data);
      }
    } catch (err) {
      console.warn('Fallback items loaded:', err);
    } finally {
      setLoading(false);
    }
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

  const handleBuyNow = async (item) => {
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
          itemTitle: item.title,
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Order creation failed. Please check network connection.');
    } finally {
      setPurchasing(false);
    }
  };

  const categories = ['ALL', 'Apparel', 'Outerwear', 'Denim', 'Footwear', 'Accessories'];

  const fallbackFeedItems = [
    {
      id: 'item-101',
      title: '1990s Vintage Levi 501 Heavyweight Denim',
      description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Heavyweight 14oz rigid denim.',
      price: 5499,
      category: 'Denim',
      size: 'W32 L30',
      era: '90s',
      condition: 'LIKE_NEW',
      images: [
        '/images/denim_vintage.png',
      ],
      status: 'AVAILABLE',
      shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', city: 'Mumbai', isVerified: true, address: '42 Bandra West, Hill Road' },
    },
    {
      id: 'item-102',
      title: 'Distressed Harley Davidson Leather Jacket',
      description: 'Heavy patina genuine leather bomber jacket from late 80s. Authentic motorcycle heritage piece.',
      price: 12500,
      category: 'Outerwear',
      size: 'L',
      era: '80s',
      condition: 'GENTLY_USED',
      images: [
        '/images/leather_jacket.png',
      ],
      status: 'AVAILABLE',
      shop: { id: 'shop-2', shopName: 'Retro Vault', city: 'Bengaluru', isVerified: true, address: '108 Indiranagar, 100ft Road' },
    },
    {
      id: 'item-103',
      title: 'Y2K Stussy Graphic Heavyweight Tee',
      description: 'Single stitch faded black graphic tee. Pre-shrunk vintage cotton drop with archival graphic.',
      price: 2800,
      category: 'Apparel',
      size: 'XL',
      era: 'Y2K',
      condition: 'LIKE_NEW',
      images: [
        '/images/graphic_tee.png',
      ],
      status: 'AVAILABLE',
      shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', city: 'Delhi', isVerified: false, address: '15 Hauz Khas Village' },
    },
  ];

  const displayItems = items.length > 0 ? items : fallbackFeedItems;

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Top Banner & Category Filter Ticker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-800/80 gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Thrift Store Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Catalog Racks
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Real-time physical inventory continuously synced across verified boutique racks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neon-lime text-black shadow-[0_0_16px_rgba(204,255,0,0.3)]'
                  : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-street-card/80 border border-zinc-800 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => {
            const images = item.images && item.images.length > 0 ? item.images : ['/images/denim_vintage.png'];
            const curImgIdx = activeImageIndex[item.id] || 0;

            return (
              <div
                key={item.id}
                className="group bg-street-card/80 border border-zinc-800/90 hover:border-zinc-700/90 rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden card-hover-effect shadow-xl backdrop-blur-sm"
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

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                    <span
                      className={
                        item.condition === 'LIKE_NEW'
                          ? 'badge-condition-like-new'
                          : item.condition === 'GENTLY_USED'
                          ? 'badge-condition-gently-used'
                          : 'badge-condition-flawed'
                      }
                    >
                      {formatCondition(item.condition)}
                    </span>
                    {item.era && (
                      <span className="bg-black/70 text-zinc-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-700/80 backdrop-blur-md">
                        {item.era}
                      </span>
                    )}
                  </div>

                  {/* Size & Heart Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={(e) => toggleSaveGrail(item.id, e)}
                      title={savedGrailIds.includes(item.id) ? 'Saved to Watchlist' : 'Save Item'}
                      className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-sm ${
                        savedGrailIds.includes(item.id)
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-black/70 text-zinc-300 border-zinc-700/80 hover:text-white hover:border-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${savedGrailIds.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neon-lime text-black shadow-sm">
                      {item.size || 'OS'}
                    </span>
                  </div>

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

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Price</span>
                      <span className="text-xl font-bold text-white tracking-tight tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuyNow(item)}
                      disabled={purchasing || item.status === 'SOLD'}
                      className="bg-white hover:bg-neon-lime text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{item.status === 'SOLD' ? 'Sold Out' : 'Buy Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal Overlay */}
      {quickViewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-street-card border border-zinc-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative font-sans shadow-2xl animate-fade-in">
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
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                      Condition: <strong className="text-white">{formatCondition(quickViewItem.condition)}</strong>
                    </span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                      Size: <strong className="text-white">{quickViewItem.size || 'OS'}</strong>
                    </span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                      Era: <strong className="text-white">{quickViewItem.era || '90s'}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed pt-2">
                    {quickViewItem.description}
                  </p>

                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-1">
                    <div className="text-zinc-500 font-medium">Sold By Verified Vendor:</div>
                    <div className="text-white font-semibold flex items-center gap-1.5">
                      {quickViewItem.shop?.shopName || 'Relic Vintage Co.'}
                      <ShieldCheck className="w-4 h-4 text-neon-lime" />
                    </div>
                    <div className="text-zinc-400 text-[11px]">{quickViewItem.shop?.address || 'Bandra West, Mumbai'}</div>
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
                    <Link
                      href={`/item/${quickViewItem.id}`}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-zinc-700 transition-all"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => {
                        const itemToBuy = quickViewItem;
                        setQuickViewItem(null);
                        handleBuyNow(itemToBuy);
                      }}
                      className="bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Instant Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-street-card border border-neon-lime/60 rounded-2xl w-full max-w-md p-6 text-center space-y-4 shadow-2xl relative animate-fade-in">
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
          </div>
        </div>
      )}
    </div>
  );
}
