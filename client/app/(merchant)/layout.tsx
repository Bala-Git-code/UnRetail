'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, ListFilter, ShoppingBag, Store, ArrowLeft, LogOut, ShieldCheck, Camera } from 'lucide-react';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Snap & Sell', href: '/dashboard/new-item', icon: Camera, highlight: true },
    { label: 'Inventory', href: '/dashboard/listings', icon: ListFilter },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 pb-16 md:pb-0">
      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 p-6 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo & Shop Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-teal-500/20">
                <Store className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
                Un<span className="text-teal-400">Merchant</span>
              </span>
            </Link>

            <div className="p-3 rounded-2xl bg-slate-950 border border-teal-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-white truncate flex items-center gap-1">
                  Relic Vintage <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </h4>
                <span className="text-[10px] text-teal-400 font-medium">Verified Shop • Mumbai</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/dashboard'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" /> Sales Overview
            </Link>

            <Link
              href="/dashboard/new-item"
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                pathname === '/dashboard/new-item'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" /> 60-Second Upload
            </Link>

            <Link
              href="/dashboard/listings"
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/dashboard/listings'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ListFilter className="w-4 h-4 text-emerald-400" /> Inventory Desk
            </Link>

            <Link
              href="/orders"
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/orders'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" /> Orders & Shipping
            </Link>
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-800">
          <Link
            href="/feed"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> View Customer Feed
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
            <Store className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white">Relic Vintage Co.</span>
        </div>
        <Link href="/feed" className="text-xs text-teal-400 font-semibold flex items-center gap-1">
          Customer View &rarr;
        </Link>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                item.highlight
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold px-4 py-1.5 shadow-lg shadow-teal-500/20'
                  : isActive
                  ? 'text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
