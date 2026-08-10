import Link from 'next/link';
import { ArrowLeft, Tag, ShieldCheck, ShoppingBag, Store, Heart, Truck, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  // Mock item detail for PDP
  const item = {
    id: itemId,
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    price: 68.0,
    category: 'Apparel',
    condition: 'Excellent Vintage Condition',
    description:
      'Authentic Made-in-USA vintage 501 jeans with natural fading and slight distressed whiskering around the knee line. Raw hem, copper rivets, 100% heavyweight cotton denim.',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    ],
    shop: {
      name: 'Relic Vintage Co.',
      location: 'Portland, OR',
      verified: true,
    },
    shipping: 'Ships in 1-2 business days via USPS Priority',
  };

  return (
    <div className="space-y-6">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-900">
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {item.images.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl overflow-hidden glass-card border border-slate-800 bg-slate-900"
              >
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20 inline-flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {item.condition}
                </span>
                <span className="text-xs text-slate-400">ID: {item.id}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-100">{item.title}</h1>
              <p className="text-3xl font-black text-emerald-400">{formatCurrency(item.price)}</p>
            </div>

            {/* Merchant Card */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    {item.shop.name}
                    {item.shop.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h4>
                  <p className="text-xs text-slate-400">{item.shop.location}</p>
                </div>
              </div>
              <Link
                href="/shops"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold rounded-lg text-slate-200"
              >
                View Shop
              </Link>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Item Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed glass-card p-4 rounded-2xl border border-slate-800/60">
                {item.description}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center gap-3 text-xs text-slate-400 glass-card p-3 rounded-xl border border-slate-800">
              <Truck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{item.shipping}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <button className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Buy Now
            </button>
            <button className="p-4 glass-card hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
