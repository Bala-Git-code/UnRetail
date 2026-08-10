import { ShoppingBag, Package, CheckCircle2, Clock, Truck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CUSTOMER_ORDERS = [
  {
    id: 'ord-8801',
    date: 'August 8, 2026',
    item_title: '1990s Vintage Levi 501 Heavyweight Denim',
    shop_name: 'Relic Vintage Co.',
    price: 68.0,
    status: 'shipped',
    tracking: 'USPS940011189956',
  },
  {
    id: 'ord-8794',
    date: 'July 24, 2026',
    item_title: 'Distressed Harley Davidson Leather Jacket',
    shop_name: 'Retro Vault',
    price: 185.0,
    status: 'delivered',
    tracking: 'UPS1Z99999999',
  },
];

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-emerald-400" /> Order History
        </h1>
        <p className="text-sm text-slate-400">Track and view your pre-loved purchases and shipping updates.</p>
      </div>

      <div className="space-y-4">
        {CUSTOMER_ORDERS.map((ord) => (
          <div
            key={ord.id}
            className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">{ord.id}</span>
                <span className="text-xs text-slate-500">• {ord.date}</span>
                {ord.status === 'delivered' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" /> Shipped
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100">{ord.item_title}</h3>
              <p className="text-xs text-slate-400">Merchant: {ord.shop_name}</p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
              <div className="text-right">
                <span className="block text-xs text-slate-400">Total Paid</span>
                <span className="text-xl font-black text-emerald-400">{formatCurrency(ord.price)}</span>
              </div>
              <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all">
                Order Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
