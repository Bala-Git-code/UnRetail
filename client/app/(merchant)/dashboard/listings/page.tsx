import Link from 'next/link';
import { PackagePlus, Search, Edit, Trash2, Tag, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const MERCHANT_ITEMS = [
  {
    id: 'item-101',
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    category: 'Apparel',
    condition: 'Excellent',
    price: 68.0,
    status: 'active',
    views: 142,
  },
  {
    id: 'item-103',
    title: 'Rare Tour Tee 1994 Band Graphic',
    category: 'T-Shirts',
    condition: 'Mint Vintage',
    price: 95.0,
    status: 'active',
    views: 89,
  },
  {
    id: 'item-109',
    title: 'Retro Corduroy Trucker Jacket',
    category: 'Outerwear',
    condition: 'Good',
    price: 78.0,
    status: 'draft',
    views: 12,
  },
];

export default function MerchantListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Inventory Management Desk</h1>
          <p className="text-xs text-slate-400">View, edit, or adjust status of your thrift inventory.</p>
        </div>

        <Link
          href="/dashboard/new-item"
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-2 text-xs shadow-md shadow-amber-500/10"
        >
          <PackagePlus className="w-4 h-4 stroke-[2.5]" /> Add New Item
        </Link>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your inventory by title or SKU..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
              Filter: All Statuses
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MERCHANT_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-slate-100">{item.title}</td>
                  <td className="py-3.5 px-4">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20">
                      {item.condition}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(item.price)}</td>
                  <td className="py-3.5 px-4">
                    {item.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px]">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-500" /> {item.views}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
