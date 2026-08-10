import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const MERCHANT_ORDERS = [
  {
    id: 'ORD-901',
    customer_email: 'alex@example.com',
    item_title: 'Vintage 1994 Band Tee',
    price: 95.0,
    shipping_address: '742 Evergreen Terrace, Springfield, OR',
    date: 'August 9, 2026',
    status: 'pending',
  },
  {
    id: 'ORD-892',
    customer_email: 'sarah@example.com',
    item_title: 'Levi 501 Heavy Denim',
    price: 68.0,
    shipping_address: '100 Main St, Seattle, WA',
    date: 'August 6, 2026',
    status: 'fulfilled',
    tracking: 'USPS940011189956',
  },
];

export default function MerchantOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-amber-400" /> Order Fulfillment Desk
        </h1>
        <p className="text-xs text-slate-400">Manage customer purchases, print shipping labels, and enter tracking.</p>
      </div>

      <div className="space-y-4">
        {MERCHANT_ORDERS.map((ord) => (
          <div key={ord.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-amber-400">{ord.id}</span>
                <span className="text-xs text-slate-400">• {ord.date}</span>
              </div>
              {ord.status === 'fulfilled' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Shipping Complete
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] flex items-center gap-1 border border-amber-500/20">
                  <Clock className="w-3 h-3" /> Awaiting Label Print
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Purchased Item</span>
                <h4 className="font-bold text-sm text-slate-100">{ord.item_title}</h4>
                <p className="text-xs text-emerald-400 font-bold mt-0.5">{formatCurrency(ord.price)}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Customer & Shipping</span>
                <p className="text-xs font-semibold text-slate-200">{ord.customer_email}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {ord.shipping_address}
                </p>
              </div>

              <div className="flex items-center justify-end">
                {ord.status === 'pending' ? (
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Fulfill & Add Tracking
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Tracking: {ord.tracking}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
