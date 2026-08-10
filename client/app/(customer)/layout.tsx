import Link from 'next/link';
import { ShoppingBag, Search, Store, ShoppingCart, User, Compass } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/feed" className="flex items-center gap-2 text-xl font-extrabold tracking-tight shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
              U
            </div>
            <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent hidden sm:inline">
              UNRETAIL
            </span>
          </Link>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vintage denim, leather jackets, rare graphic tees..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Nav Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/feed"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-400" /> Feed
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all md:hidden"
            >
              <Search className="w-4 h-4 text-emerald-400" /> Search
            </Link>

            <Link
              href="/shops"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              <Store className="w-4 h-4 text-amber-400" /> Shops
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-teal-400" /> Orders
            </Link>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl relative transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <Link
              href="/login"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <User className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
