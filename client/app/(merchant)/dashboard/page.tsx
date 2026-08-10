import Link from 'next/link';
import { DollarSign, Package, ShoppingBag, TrendingUp, PackagePlus, ArrowUpRight, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function MerchantDashboardPage() {
  const stats = [
    {
      title: 'Total Revenue (30d)',
      value: formatCurrency(3420.0),
      change: '+18.4%',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Listings',
      value: '42 items',
      change: '+6 this week',
      icon: Package,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Pending Fulfillment',
      value: '3 orders',
      change: 'Requires action',
      icon: ShoppingBag,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Merchant Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Storefront: Relic Vintage Co. • ID: shop-101</p>
        </div>

        <Link
          href="/dashboard/new-item"
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2 text-sm"
        >
          <PackagePlus className="w-4 h-4 stroke-[2.5]" /> Quick 60-Sec Item Upload
        </Link>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {stat.change}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Inventory Acceleration</span>
          <h2 className="text-xl font-bold text-slate-100">Ready to list new thrift arrivals?</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our 60-Second item creator automatically syncs photos and metadata directly to the live buyer feed and Meilisearch engine.
          </p>
        </div>
        <Link
          href="/dashboard/new-item"
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all"
        >
          Open Listing Desk <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>

      {/* Recent Sales Table */}
      <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-base">Recent Sales & Activity</h3>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-amber-400 hover:underline">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payout</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">ORD-901</td>
                <td className="py-3 px-4 font-bold text-slate-100">Vintage 1994 Band Tee</td>
                <td className="py-3 px-4">alex@example.com</td>
                <td className="py-3 px-4 font-bold text-emerald-400">$95.00</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                    Pending Shipment
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">ORD-892</td>
                <td className="py-3 px-4 font-bold text-slate-100">Levi 501 Heavy Denim</td>
                <td className="py-3 px-4">sarah@example.com</td>
                <td className="py-3 px-4 font-bold text-emerald-400">$68.00</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    Fulfilled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
