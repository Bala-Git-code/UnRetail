'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, PlusCircle, CheckCircle2, AlertCircle, Edit, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function InventoryDeskPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await apiClient.get('/items?status=AVAILABLE');
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (err) {
      console.warn('Inventory fetch error, using fallback data:', err);
      setItems([
        {
          id: 'item-101',
          title: '1990s Vintage Levi 501 Heavyweight Denim',
          category: 'Apparel',
          price: 68.0,
          status: 'AVAILABLE',
          era: '90s',
          condition: 'LIKE_NEW',
          images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80'],
        },
        {
          id: 'item-103',
          title: 'Rare Tour Tee 1994 Band Graphic',
          category: 'T-Shirts',
          price: 95.0,
          status: 'AVAILABLE',
          era: '90s',
          condition: 'LIKE_NEW',
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    try {
      await apiClient.patch(`/items/${itemId}`, { status: 'SOLD' });
      setItems(items.map((item) => (item.id === itemId ? { ...item, status: 'SOLD' } : item)));
    } catch (err) {
      alert('Updated status locally for prototype demo.');
      setItems(items.map((item) => (item.id === itemId ? { ...item, status: 'SOLD' } : item)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Merchant Inventory Desk</h1>
          <p className="text-xs text-slate-400 mt-1">Manage shop listings, mark offline in-store sales, or update details.</p>
        </div>

        <Link
          href="/dashboard/new-item"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 text-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add 1-of-1 Piece
        </Link>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          <p className="text-xs">Loading shop inventory...</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Item Piece</th>
                  <th className="px-6 py-4">Category / Era</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                          <span className="text-[11px] text-slate-400">ID: {item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-medium">
                        {item.category} ({item.era || '90s'})
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400 text-sm">₹{item.price}</td>
                    <td className="px-6 py-4">
                      {item.status === 'AVAILABLE' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] font-semibold">
                          Sold Out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {item.status === 'AVAILABLE' && (
                        <button
                          onClick={() => handleMarkAsSold(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold hover:bg-teal-500/20 transition-all"
                        >
                          Mark Sold (In-Store)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
