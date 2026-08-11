'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Store,
  ShoppingCart,
  User,
  Compass,
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Shield,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  shopName: string;
  size: string;
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [cartOpen, setCartOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'item-101',
      title: '1990s Vintage Levi 501 Heavyweight Denim',
      price: 68.0,
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80',
      shopName: 'Relic Vintage Co.',
      size: 'W32 L30',
    },
    {
      id: 'item-103',
      title: 'Rare Tour Tee 1994 Band Graphic',
      price: 95.0,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
      shopName: 'Relic Vintage Co.',
      size: 'L',
    },
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/feed" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent hidden sm:inline">
              Un<span className="text-emerald-400">Retail</span>
            </span>
          </Link>

          {/* Sticky Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1-of-1 vintage Levi's, leather bombers, graphic tees..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
              /
            </span>
          </form>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/feed"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/feed'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" /> <span className="hidden lg:inline">Feed</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/search'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" /> <span className="hidden lg:inline">Search</span>
            </Link>

            <Link
              href="/shops"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/shops'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" /> <span className="hidden lg:inline">Shops</span>
            </Link>

            <Link
              href="/orders"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/orders'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-teal-400" /> <span className="hidden lg:inline">Orders</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl relative transition-all flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="h-4 w-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Portals</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {portalMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Switch Active Portal
                  </div>
                  <Link
                    href="/feed"
                    onClick={() => setPortalMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                  >
                    <Compass className="w-4 h-4 text-emerald-400" /> Customer Feed
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setPortalMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-teal-400"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-400" /> Merchant Desk
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setPortalMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-400"
                  >
                    <Shield className="w-4 h-4 text-amber-400" /> Admin Oversight
                  </Link>
                  <div className="my-1 border-t border-slate-800" />
                  <Link
                    href="/login"
                    onClick={() => setPortalMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-slate-800"
                  >
                    Sign In / OAuth
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      {/* Slide-over Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Shopping Cart</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Your cart is empty. Add 1-of-1 thrift pieces from the discovery feed!
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3"
                    >
                      <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-900 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.shopName} • Size: <span className="text-slate-200 font-medium">{item.size}</span>
                        </p>
                        <span className="text-xs font-extrabold text-emerald-400 mt-1 block">₹{item.price}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Total (Single-stock items):</span>
                  <span className="text-xl font-extrabold text-white">₹{cartTotal}</span>
                </div>
                <Link
                  href="/item/item-101"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2"
                >
                  Proceed to Razorpay Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">UnRetail Customer Portal</span>
          </div>
          <p className="text-slate-500">Sub-50ms Typo-Tolerant Search • Direct Cloudinary Uploads • Razorpay Payments</p>
        </div>
      </footer>
    </div>
  );
}
