import Link from 'next/link';
import { LayoutDashboard, PackagePlus, ListFilter, ShoppingBag, Store, ArrowLeft, LogOut } from 'lucide-react';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-r border-slate-800 p-6 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo & Shop Header */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm">
                M
              </div>
              <span className="bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
                UNRETAIL
              </span>
            </Link>

            <div className="glass-card p-3.5 rounded-2xl border border-amber-500/20 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                <Store className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-100 truncate">Relic Vintage Co.</h4>
                <span className="text-[10px] text-amber-400 font-medium">Merchant Desk</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" /> Sales Overview
            </Link>

            <Link
              href="/dashboard/new-item"
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              <PackagePlus className="w-4 h-4 stroke-[2.5]" /> 60-Second Upload
            </Link>

            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
            >
              <ListFilter className="w-4 h-4 text-emerald-400" /> Inventory Desk
            </Link>

            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-teal-400" /> Fulfillment Orders
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
            className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
