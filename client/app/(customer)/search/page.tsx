'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Store, Sparkles, SlidersHorizontal, X, Tag } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function SearchFacetedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [era, setEra] = useState('');
  const [condition, setCondition] = useState('');
  const [city, setCity] = useState('');
  const [priceMax, setPriceMax] = useState('200');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<string>('Meilisearch');

  useEffect(() => {
    handleSearch();
  }, [category, size, era, condition, city, priceMax]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (category) params.append('category', category);
      if (era) params.append('era', era);
      if (condition) params.append('condition', condition);
      if (city) params.append('city', city);

      const response = await apiClient.get(`/items?${params.toString()}`);
      if (response.data.success) {
        setItems(response.data.data);
        setSearchSource(response.data.source || 'Meilisearch Engine');
      }
    } catch (err) {
      console.warn('Search query fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setSize('');
    setEra('');
    setCondition('');
    setCity('');
    setPriceMax('200');
  };

  const activeFilterCount = [category, size, era, condition, city].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Faceted Vintage Search</h1>
        <p className="text-xs text-slate-400 mt-1">
          Sub-50ms typo-tolerant search indexed by Meilisearch across independent thrift shops.
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Levi 501s, Harley leather jackets, Japanese silk kimonos..."
            className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-xs font-extrabold hover:opacity-95 transition-opacity shadow-md"
          >
            Search
          </button>
        </div>
      </form>

      {/* Content Grid: Sticky Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Filter Sidebar */}
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 p-5 rounded-3xl h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              <option value="Apparel">Apparel</option>
              <option value="Outerwear">Outerwear</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Accessories">Accessories</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>

          {/* Era Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Vintage Era</label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Eras</option>
              <option value="70s">70s Retro</option>
              <option value="80s">80s Classic</option>
              <option value="90s">90s Grunge</option>
              <option value="Y2K">Y2K (2000s)</option>
              <option value="Modern">Modern Vintage</option>
            </select>
          </div>

          {/* Condition Grade Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Condition Grade</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Conditions</option>
              <option value="LIKE_NEW">Like New / Mint</option>
              <option value="GENTLY_USED">Gently Used</option>
              <option value="FLAWED">Distressed / Flawed</option>
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. W32, M, XL..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">City Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Bengaluru, Delhi..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">
              Found <strong className="text-white">{items.length}</strong> items • Powered by{' '}
              <span className="text-emerald-400 font-semibold">{searchSource}</span>
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              No items matching your criteria. Try adjusting or clearing search filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                      {item.era || '90s'}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-lg font-extrabold text-white">₹{item.price}</span>
                      <span className="text-xs font-semibold text-emerald-400">View Piece &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
