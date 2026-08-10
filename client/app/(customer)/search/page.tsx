'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Tag, DollarSign, RefreshCw, X, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);

  const mockSearchResults = [
    {
      id: 'sr-1',
      title: '70s Vintage Leather Biker Boots',
      category: 'Footwear',
      condition: 'Excellent',
      price: 145.0,
      shop: 'Sole Relics',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'sr-2',
      title: 'Retro Oversized Knit Sweater 90s Pattern',
      category: 'Apparel',
      condition: 'Mint',
      price: 48.0,
      shop: 'Cozy Vintage',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-400" /> Search Marketplace & Meilisearch Index
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, brand, era (e.g. 90s, Levi's, Leather)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-10 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Filters
            </span>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCondition('All');
                setMaxPrice(250);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Apparel">Apparel</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">Any Condition</option>
              <option value="Mint">Mint Vintage</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair / Distressed</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing results for fast search query</span>
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort: Newest First
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockSearchResults.map((res) => (
              <div key={res.id} className="glass-card rounded-2xl border border-slate-800 p-4 flex gap-4 items-center">
                <img src={res.image} alt={res.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {res.condition}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{res.title}</h4>
                  <p className="text-xs text-slate-400">Sold by {res.shop}</p>
                  <p className="font-black text-emerald-400 text-sm">{formatCurrency(res.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
